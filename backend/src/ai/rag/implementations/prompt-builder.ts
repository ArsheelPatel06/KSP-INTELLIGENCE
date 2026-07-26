import type { RagPromptBuilder, RagPromptBuilderInput } from '../prompt-builder.interface';
import type { RagPromptContext } from '../rag.types';

export class StandardPromptBuilder implements RagPromptBuilder {
  public async build(input: RagPromptBuilderInput): Promise<RagPromptContext> {
    const formattedText = input.contextWindow.chunks.map(chunk => chunk.chunk.text).join('\n\n');

    const systemPrompt = `
You are an intelligent legal and investigative assistant for the Karnataka State Police.
Use the following retrieved context to answer the user's query.
If the answer is not contained within the context, state that you do not know based on the provided evidence.
Always cite the Source Document IDs when presenting facts.

Context:
${formattedText}
`;

    return {
      systemInstructionsKey: 'default_rag_prompt',
      userQuery: input.query.query,
      collectionHints: [],
      evidenceSummary: [systemPrompt],
      citations: input.contextWindow.citations,
      contextWindow: input.contextWindow,
    };
  }
}
