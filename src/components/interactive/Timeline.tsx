import { cn } from '@/lib/utils';

interface TimelineItem {
  title: string;
  description?: string;
  date?: string;
  status?: 'completed' | 'current' | 'upcoming';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-4 h-4 rounded-full',
                item.status === 'completed' && 'bg-green-500',
                item.status === 'current' && 'bg-blue-500',
                item.status === 'upcoming' && 'bg-gray-300'
              )}
            />
            {index < items.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mt-1" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            {item.description && (
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            )}
            {item.date && (
              <p className="text-xs text-gray-400 mt-1">{item.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 