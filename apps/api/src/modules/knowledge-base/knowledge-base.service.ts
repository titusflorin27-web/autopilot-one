import { BadRequestException, Injectable } from "@nestjs/common";
import { KnowledgeSourceStatus, KnowledgeSourceType } from "@prisma/client";
import { createHash } from "crypto";
import { inflateRawSync } from "zlib";
import { PrismaService } from "../../common/prisma.service";
import { CreateTextSourceDto } from "./dto/create-text-source.dto";
import { CreateWebsiteSourceDto } from "./dto/create-website-source.dto";
import { SearchKnowledgeDto } from "./dto/search-knowledge.dto";

const MAX_CHUNK_TOKENS = 240;
const MAX_SEARCH_CANDIDATES = 200;

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly prisma: PrismaService) {}

  listSources(organizationId: string) {
    return this.prisma.knowledgeSource.findMany({
      where: { organizationId },
      include: { _count: { select: { chunks: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async createTextSource(dto: CreateTextSourceDto) {
    return this.indexSource({
      organizationId: dto.organizationId,
      title: dto.title.trim(),
      type: KnowledgeSourceType.TXT,
      fileName: dto.fileName,
      mimeType: "text/plain",
      content: dto.content,
    });
  }

  async createWebsiteSource(dto: CreateWebsiteSourceDto) {
    const response = await fetch(dto.url, {
      headers: { "User-Agent": "Autopilot-One-KnowledgeBot/0.5" },
    });

    if (!response.ok) {
      throw new BadRequestException(`Website fetch failed with status ${response.status}`);
    }

    const html = await response.text();
    const title = dto.title?.trim() || this.extractTitle(html) || dto.url;

    return this.indexSource({
      organizationId: dto.organizationId,
      title,
      type: KnowledgeSourceType.WEBSITE,
      url: dto.url,
      mimeType: response.headers.get("content-type") ?? "text/html",
      content: this.stripHtml(html),
    });
  }

  async uploadFile(organizationId: string, title: string | undefined, file: { originalname?: string; mimetype?: string; buffer?: Buffer }) {
    if (!file?.buffer?.length) {
      throw new BadRequestException("A file is required");
    }

    const fileName = file.originalname ?? "knowledge-source";
    const mimeType = file.mimetype ?? "application/octet-stream";
    const type = this.detectSourceType(fileName, mimeType);
    const content = this.extractFileText(type, file.buffer);

    if (!content.trim()) {
      throw new BadRequestException("No indexable text could be extracted from this file");
    }

    return this.indexSource({
      organizationId,
      title: title?.trim() || fileName,
      type,
      fileName,
      mimeType,
      content,
    });
  }

  async search(dto: SearchKnowledgeDto) {
    const queryTokens = this.tokenize(dto.query);

    if (!queryTokens.length) {
      return [];
    }

    const chunks = await this.prisma.knowledgeChunk.findMany({
      where: {
        organizationId: dto.organizationId,
        source: { status: KnowledgeSourceStatus.INDEXED },
      },
      include: {
        source: {
          select: { id: true, title: true, type: true },
        },
      },
      take: MAX_SEARCH_CANDIDATES,
      orderBy: { createdAt: "desc" },
    });

    return chunks
      .map((chunk) => ({
        chunkId: chunk.id,
        sourceId: chunk.source.id,
        sourceTitle: chunk.source.title,
        sourceType: chunk.source.type,
        content: chunk.content,
        score: this.scoreChunk(dto.query, queryTokens, chunk.content),
      }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, dto.limit ?? 8);
  }

  private async indexSource(input: {
    organizationId: string;
    title: string;
    type: KnowledgeSourceType;
    content: string;
    url?: string;
    fileName?: string;
    mimeType?: string;
  }) {
    const normalizedContent = this.normalizeText(input.content);
    const chunks = this.chunkText(normalizedContent);

    if (!chunks.length) {
      throw new BadRequestException("Knowledge source does not contain enough text to index");
    }

    return this.prisma.$transaction(async (tx) => {
      const source = await tx.knowledgeSource.create({
        data: {
          organizationId: input.organizationId,
          title: input.title,
          type: input.type,
          url: input.url,
          fileName: input.fileName,
          mimeType: input.mimeType,
          contentHash: this.hash(normalizedContent),
          status: KnowledgeSourceStatus.INDEXED,
        },
      });

      await tx.knowledgeChunk.createMany({
        data: chunks.map((content, index) => ({
          organizationId: input.organizationId,
          sourceId: source.id,
          chunkIndex: index,
          content,
          tokenCount: this.tokenize(content).length,
        })),
      });

      return tx.knowledgeSource.findUnique({
        where: { id: source.id },
        include: { _count: { select: { chunks: true } } },
      });
    });
  }

  private detectSourceType(fileName: string, mimeType: string): KnowledgeSourceType {
    const lowerName = fileName.toLowerCase();

    if (mimeType.includes("pdf") || lowerName.endsWith(".pdf")) {
      return KnowledgeSourceType.PDF;
    }

    if (mimeType.includes("wordprocessingml") || lowerName.endsWith(".docx")) {
      return KnowledgeSourceType.DOCX;
    }

    if (mimeType.includes("text") || lowerName.endsWith(".txt")) {
      return KnowledgeSourceType.TXT;
    }

    throw new BadRequestException("Supported file types are PDF, DOCX and TXT");
  }

  private extractFileText(type: KnowledgeSourceType, buffer: Buffer): string {
    if (type === KnowledgeSourceType.TXT) {
      return buffer.toString("utf8");
    }

    if (type === KnowledgeSourceType.PDF) {
      return this.extractPdfLikeText(buffer);
    }

    if (type === KnowledgeSourceType.DOCX) {
      return this.extractDocxText(buffer);
    }

    return "";
  }

  private extractPdfLikeText(buffer: Buffer): string {
    return buffer
      .toString("latin1")
      .replace(/\\r|\\n/g, " ")
      .replace(/\([^)]{3,}\)/g, (match) => ` ${match.slice(1, -1)} `)
      .replace(/[^\x20-\x7E]+/g, " ");
  }

  private extractDocxText(buffer: Buffer): string {
    const documentXml = this.extractZipEntry(buffer, "word/document.xml");

    if (!documentXml) {
      return "";
    }

    return documentXml
      .replace(/<w:tab\/>/g, "\t")
      .replace(/<w:br\/>/g, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  }

  private extractZipEntry(buffer: Buffer, entryName: string): string | null {
    let offset = 0;

    while (offset < buffer.length - 30) {
      if (buffer.readUInt32LE(offset) !== 0x04034b50) {
        offset += 1;
        continue;
      }

      const compressionMethod = buffer.readUInt16LE(offset + 8);
      const compressedSize = buffer.readUInt32LE(offset + 18);
      const uncompressedSize = buffer.readUInt32LE(offset + 22);
      const fileNameLength = buffer.readUInt16LE(offset + 26);
      const extraLength = buffer.readUInt16LE(offset + 28);
      const nameStart = offset + 30;
      const nameEnd = nameStart + fileNameLength;
      const name = buffer.slice(nameStart, nameEnd).toString("utf8");
      const dataStart = nameEnd + extraLength;
      const dataEnd = dataStart + compressedSize;

      if (name === entryName) {
        const compressed = buffer.slice(dataStart, dataEnd);

        if (compressionMethod === 0) {
          return compressed.toString("utf8");
        }

        if (compressionMethod === 8) {
          return inflateRawSync(compressed, { finishFlush: 2 }).toString("utf8");
        }

        return null;
      }

      offset = dataEnd + Math.max(0, uncompressedSize - uncompressedSize);
    }

    return null;
  }

  private chunkText(text: string): string[] {
    const words = this.normalizeText(text).split(/\s+/).filter(Boolean);
    const chunks: string[] = [];

    for (let index = 0; index < words.length; index += MAX_CHUNK_TOKENS) {
      const chunk = words.slice(index, index + MAX_CHUNK_TOKENS).join(" ").trim();

      if (chunk.length >= 20) {
        chunks.push(chunk);
      }
    }

    return chunks;
  }

  private scoreChunk(query: string, queryTokens: string[], content: string): number {
    const contentTokens = new Set(this.tokenize(content));
    const matches = queryTokens.filter((token) => contentTokens.has(token)).length;
    const phraseBonus = content.toLowerCase().includes(query.toLowerCase()) ? 2 : 0;

    return matches / queryTokens.length + phraseBonus;
  }

  private tokenize(value: string): string[] {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2);
  }

  private normalizeText(value: string): string {
    return value.replace(/\s+/g, " ").trim();
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&");
  }

  private extractTitle(html: string): string | null {
    const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
    return match?.[1]?.replace(/\s+/g, " ").trim() || null;
  }

  private hash(content: string): string {
    return createHash("sha256").update(content).digest("hex");
  }
}
