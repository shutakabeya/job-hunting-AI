'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompanyMatch } from '@/types/company';
import { CheckCircle, ArrowRight, Star, Building2, Briefcase } from 'lucide-react';

interface CompanyListProps {
  companies: CompanyMatch[];
  displayedCount?: number;
  showMoreButton?: boolean;
  onShowMore?: () => void;
}

export default function CompanyList({
  companies,
  displayedCount = 10,
  showMoreButton = false,
  onShowMore
}: CompanyListProps) {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<CompanyMatch | null>(null);

  const handleCompanySelect = (company: CompanyMatch) => {
    setSelectedCompany(company);
    router.push(`/companies/${company.id}`);
  };

  const displayedCompanies = companies.slice(0, displayedCount);

  return (
    <div className="space-y-6">
      {displayedCompanies.map((company) => (
        <Card key={company.id} className="p-6">
          <div className="flex justify-between items-start">
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{company.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {company.matchScore}点
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    {company.industry}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {company.size}
                  </Badge>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">{company.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">マッチングポイント</h4>
                  <ul className="space-y-2">
                    {company.matchingPoints.map((point, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {company.tags?.matching?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">課題ポイント</h4>
                  <ul className="space-y-2">
                    {company.challengePoints.map((point, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <ArrowRight className="h-5 w-5 text-orange-500" />
                        <span className="text-gray-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {company.tags?.challenge?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleCompanySelect(company)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  企業詳細を見る
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {showMoreButton && (
        <div className="flex justify-center">
          <Button
            onClick={onShowMore}
            variant="outline"
            className="mt-4"
          >
            もっと見る
          </Button>
        </div>
      )}
    </div>
  );
} 