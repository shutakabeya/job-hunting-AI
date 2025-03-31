public findMatchingCompanies(): Array<Company & { matchScore: number; matchReason: string }> {
  const companies = this.masterDataService.getCompanyData();
  const matches: Array<Company & { matchScore: number; matchReason: string }> = [];

  companies.forEach(company => {
    const matchScore = this.calculateMatchScore(company);
    const matchReason = this.generateMatchReason(company);
    matches.push({
      ...company,
      matchScore,
      matchReason
    });
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
} 