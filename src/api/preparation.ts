import { generatePreparationTips } from './openai';

export async function prepareForCompanies(matchingResults) {
  const preparationTips = [];

  for (const company of matchingResults) {
    const tips = await generatePreparationTips(company);
    preparationTips.push({
      company,
      tips,
    });
  }

  return preparationTips;
} 