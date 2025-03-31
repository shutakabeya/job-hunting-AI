import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CardAction {
  label: string;
  action: string;
}

interface CardProps {
  title?: string;
  content?: string;
  image?: string;
  actions?: CardAction[];
  onAction: (action: string) => void;
  className?: string;
}

export function Card({
  title,
  content,
  image,
  actions,
  onAction,
  className
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-white shadow-sm overflow-hidden',
        className
      )}
    >
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title || ''}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        {content && <p className="text-gray-600">{content}</p>}
        {actions && actions.length > 0 && (
          <div className="mt-4 flex gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => onAction(action.action)}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 