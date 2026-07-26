import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { AiParsingError } from '../shared/ai-errors';

/**
 * Utility to convert Zod schemas to JSON Schemas for Ollama structured generation,
 * and to parse and validate the final JSON returned by the model.
 */
export class StructuredParser {
  /**
   * Generates a JSON schema compatible with Ollama's `format` parameter.
   */
  public static generateSchema(zodSchema: z.ZodTypeAny, name: string = 'output_schema'): Record<string, unknown> {
    // @ts-expect-error - Type instantiation is excessively deep
    const jsonSchema = zodToJsonSchema(zodSchema, name) as any;
    // Extract the definitions and root schema from zodToJsonSchema output
    const root = (jsonSchema as any).definitions?.[name] || jsonSchema;
    return root as Record<string, unknown>;
  }

  /**
   * Parses the JSON output from Ollama and validates it against the Zod schema.
   * Ensures the response strictly conforms to the expected contract.
   */
  public static parse<T>(zodSchema: z.ZodSchema<T>, rawJson: unknown): T {
    const result = zodSchema.safeParse(rawJson);
    
    if (!result.success) {
      throw new AiParsingError(
        'AI output failed Zod validation',
        typeof rawJson === 'string' ? rawJson : JSON.stringify(rawJson),
        { issues: result.error.issues }
      );
    }
    
    return result.data;
  }
}
