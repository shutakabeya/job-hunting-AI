import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
  throw new Error('Missing environment variable: PINECONE_API_KEY');
}

if (!process.env.PINECONE_ENVIRONMENT) {
  throw new Error('Missing environment variable: PINECONE_ENVIRONMENT');
}

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error('Missing environment variable: PINECONE_INDEX_NAME');
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

export async function getPineconeIndex() {
  try {
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME as string);
    return index;
  } catch (error) {
    console.error('Pineconeインデックスの取得に失敗しました:', error);
    throw error;
  }
} 