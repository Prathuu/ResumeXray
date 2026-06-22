declare module "mammoth/mammoth.browser" {
  interface MammothMessage {
    type: "warning" | "error";
    message: string;
  }

  interface MammothResult {
    value: string;
    messages: MammothMessage[];
  }

  export function extractRawText(input: {
    arrayBuffer: ArrayBuffer;
  }): Promise<MammothResult>;
}
