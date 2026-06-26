export type AiTaskType =
  | "classification"
  | "generation"
  | "summarization"
  | "extraction"
  | "reasoning";

export type AiRequest = {
  taskType: AiTaskType;
  system: string;
  input: string;
  temperature?: number;
  organizationId?: string;
};

export type AiResponse = {
  output: string;
  model: string;
  provider: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
};

export interface AiProvider {
  name: string;
  generate(request: AiRequest): Promise<AiResponse>;
}

export class AiGateway {
  constructor(private readonly providers: AiProvider[]) {}

  async run(request: AiRequest): Promise<AiResponse> {
    const provider = this.providers[0];

    if (!provider) {
      return {
        output: "AI provider not configured.",
        model: "none",
        provider: "none",
      };
    }

    return provider.generate(request);
  }
}
