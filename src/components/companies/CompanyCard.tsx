import { Company } from '@/types/company';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CompanyCardProps {
  company: Company;
  onSelect: (company: Company) => void;
  matchScore?: number;
  matchReason?: string;
}

export function CompanyCard({ company, onSelect, matchScore, matchReason }: CompanyCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect(company)}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{company.industry}</Badge>
              <Badge variant="outline">{company.size}</Badge>
            </div>
          </div>
          {matchScore !== undefined && (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{Math.round(matchScore)}%</div>
              <div className="text-sm text-gray-500">マッチ度</div>
            </div>
          )}
        </div>

        <p className="text-gray-600 line-clamp-2">{company.description}</p>

        {matchReason && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">あなたに合う理由:</div>
            <p className="text-sm text-gray-600">{matchReason}</p>
          </div>
        )}

        <div className="pt-4">
          <Progress value={matchScore} className="h-2" />
        </div>
      </div>
    </Card>
  );
} 