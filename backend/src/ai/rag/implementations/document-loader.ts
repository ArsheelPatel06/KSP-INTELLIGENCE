import fs from 'fs';
import path from 'path';
import type { RagDocumentMetadata, RagCollectionName } from '../rag.types';

export interface DocumentLoaderInput {
  filePath: string;
  collection: RagCollectionName;
  sourceType: string;
}

export interface DocumentLoaderResult {
  documentId: string;
  rawText: string;
  metadata: RagDocumentMetadata;
}

export class LocalDocumentLoader {
  
  public async load(input: DocumentLoaderInput): Promise<DocumentLoaderResult> {
    const rawText = await fs.promises.readFile(input.filePath, 'utf-8');
    const fileName = path.basename(input.filePath);
    
    // In a production system, this would parse PDFs, CSVs, and extract embedded metadata.
    // For this on-premise implementation, we rely on UTF-8 readable text (markdown, CSV, txt).

    const metadata: RagDocumentMetadata = {
      documentId: `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sourceTitle: fileName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      collection: input.collection,
      sourceType: 'manual', // from union type
      sensitivityLevel: 'restricted', // Default
      reviewStatus: 'draft',
    };

    return {
      documentId: metadata.documentId,
      rawText,
      metadata,
    };
  }
}
