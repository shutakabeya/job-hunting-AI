/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // 不要な警告を抑制
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? { properties: ['^data-new-gr-c-s-check-loaded$', '^data-gr-ext-installed$'] } : false,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    COHERE_API_KEY: process.env.COHERE_API_KEY,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
    PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME
  }
}

module.exports = nextConfig 