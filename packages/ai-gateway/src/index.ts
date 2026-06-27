export type AiTaskType =
  | "classification"
  | "generation"
  | "summarization"
  | "extraction"
  | "reasoning";

export type AiResponseFormat = "text" | "json";

export type AiRequest = {
  taskType: AiTaskType;
  system: string;
  input: string;
  temperature?: number;
  organizationId?: string;
  responseFormat?: AiResponseFormat;
  metadata?: Record<string, unknown>;
};

export type AiResponse = {
  output: string;
  model: string;
  provider: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
  error?: string;
};

export type AiJsonResponse<T> = AiResponse & {
  parsed: T | null;
};

export interface AiProvider {
  name: string;
  generate(request: AiRequest): Promise<AiResponse>;
}

export type OpenAiCompatibleProviderOptions = {
  apiKey: string;
  model: string;
  baseUrl?: string;
  providerName?: string;
};

type OpenAiChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
  error?: {
    message?: string;
  };
};

export class AiGateway {
  constructor(private readonly providers: AiProvider[]) {}

  async run(request: AiRequest): Promise<AiResponse> {
    const provider = this.providers[0];

    if (!provider) {
      return {
        output: "AI provider not configured.",
        model: "none",
        provider: "none",
        error: "AI provider not configured",
      };
    }

    try {
      return await provider.generate(request);
    } catch (error) {
      return {
        output: "AI provider failed.",
        model: "unknown",
        provider: provider.name,
        error: error instanceof Error ? error.message : "Unknown AI provider error",
      };
    }
  }

  async runJson<T>(request: AiRequest): Promise<AiJsonResponse<T>> {
    const response = await this.run({ ...request, responseFormat: "json" });

    try {
      return {
        ...response,
        parsed: JSON.parse(response.output) as T,
      };
    } catch {
      return {
        ...response,
        parsed: null,
        error: response.error ?? "AI response was not valid JSON",
      };
    }
  }
}

export class OpenAiCompatibleProvider implements AiProvider {
  readonly name: string;
  private readonly baseUrl: string;

  constructor(private readonly options: OpenAiCompatibleProviderOptions) {
    this.name = options.providerName ?? "openai-compatible";
    this.baseUrl = options.baseUrl ?? "https://api.openai.com/v1";
  }

  async generate(request: AiRequest): Promise<AiResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.options.model,
        temperature: request.temperature ?? 0.2,
        response_format: request.responseFormat === "json" ? { type: "json_object" } : undefined,
        messages: [
          { role: "system", content: request.system },
          { role: "user", content: request.input },
        ],
      }),
    });

    const data = (await response.json()) as OpenAiChatCompletionResponse;

    if (!response.ok) {
      throw new Error(data.error?.message ?? `AI provider failed with status ${response.status}`);
    }

    return {
      output: data.choices?.[0]?.message?.content ?? "",
      model: this.options.model,
      provider: this.name,
      usage: {
        inputTokens: data.usage?.prompt_tokens,
        outputTokens: data.usage?.completion_tokens,
      },
    };
  }
}

export class NullAiProvider implements AiProvider {
  readonly name = "none";

  async generate(): Promise<AiResponse> {
    return {
      output: "AI provider not configured.",
      model: "none",
      provider: this.name,
      error: "AI provider not configured",
    };
  }
}
