import { sampleCompanies } from '@/data/sampleCompanies';
import { vectorizeCompany } from '@/utils/vectorization';
import { getPineconeIndex } from '@/utils/pinecone';
import { Company } from '@/types/company';

/**
 * 企業データをPineconeにアップロードする
 */
export async function uploadCompaniesToPinecone() {
  try {
    console.log('企業データをPineconeにアップロード中...');
    const pineconeIndex = getPineconeIndex();

    // 既存のインデックスをクリア（オプション）
    // await pineconeIndex.deleteAll();

    // 各企業をベクトル化してPineconeにアップロード
    for (const company of sampleCompanies) {
      const vector = await vectorizeCompany(company);
      
      await pineconeIndex.upsert([
        {
          id: company.id,
          values: vector,
          metadata: {
            ...company,
            // 配列はPineconeのメタデータとして直接保存できないため、文字列に変換
            culture: company.culture.join(','),
            values: company.values.join(','),
            workStyle: company.workStyle.join(','),
            skills: company.skills.join(','),
            benefits: company.benefits.join(','),
          },
        },
      ]);
      
      console.log(`企業「${company.name}」をアップロードしました`);
    }

    console.log('すべての企業データのアップロードが完了しました');
  } catch (error) {
    console.error('企業データのアップロード中にエラーが発生しました:', error);
    throw error;
  }
}

// スクリプトとして直接実行された場合
if (require.main === module) {
  uploadCompaniesToPinecone()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 