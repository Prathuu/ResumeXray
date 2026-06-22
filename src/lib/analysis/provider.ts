import type { AtsAnalysis } from "@/types/analysis";

export interface AnalysisContext {
  resumeText: string;
  jobDescription?: string;
}

export interface AnalysisProvider {
  readonly id: string;
  readonly name: string;
  analyze(context: AnalysisContext): Promise<AtsAnalysis>;
}

export interface OpenAICompatibleConfig {
  endpoint: string;
  apiKey: string;
  model: string;
}

export class OpenAICompatibleProvider implements AnalysisProvider {
  readonly id = "openai-compatible";
  readonly name = "OpenAI-compatible provider";

  constructor(private readonly config: OpenAICompatibleConfig) {}

  async analyze({ resumeText, jobDescription }: AnalysisContext) {
    const response = await fetch(this.config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Return a JSON ATS analysis matching the requested application schema. Be evidence-based and concise.",
          },
          {
            role: "user",
            content: `Resume:\n${resumeText}\n\nJob description:\n${jobDescription ?? "Not provided"}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Provider request failed with status ${response.status}.`,
      );
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("The provider returned no analysis.");
    return JSON.parse(content) as AtsAnalysis;
  }
}
