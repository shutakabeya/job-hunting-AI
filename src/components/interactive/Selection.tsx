import { cn } from '@/lib/utils';

interface SelectionOption {
  value: string;
  label: string;
}

interface SelectionProps {
  options: SelectionOption[];
  selected?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Selection({
  options,
  selected,
  onChange,
  className
}: SelectionProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'w-full px-4 py-2 text-left rounded-md transition-colors',
            selected === option.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
} 