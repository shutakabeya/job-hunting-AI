'use client';

import { InteractiveElement as IInteractiveElement, InteractiveElementProps } from '@/types/chat';
import { Button } from './Button';
import { Progress } from './Progress';
import { Chart } from './Chart';
import { Timeline } from './Timeline';
import { Card } from "@/components/ui/card";
import { Selection } from './Selection';
import { Input } from './Input';
import { CompanyGrid } from '@/components/CompanyGrid';

interface Props {
  element: IInteractiveElement;
  onInteraction: (elementId: string, action: string, data?: any) => void;
}

export function InteractiveElement({ element, onInteraction }: Props) {
  const handleInteraction = (action: string, data?: any) => {
    onInteraction(element.id, action, data);
  };

  if (element.type === 'button-group') {
    return (
      <div className="flex flex-col space-y-2 w-full">
        {element.buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleInteraction(button.id, button.value)}
            className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-900 transition-colors"
          >
            {button.text}
          </button>
        ))}
      </div>
    );
  }

  switch (element.type) {
    case 'button':
      return (
        <Button
          label={element.label || ''}
          onClick={() => handleInteraction(element.action || 'click')}
          variant={element.style?.variant}
          size={element.style?.size}
          className={element.style?.className}
        />
      );

    case 'progress':
      return (
        <Progress
          value={element.data?.value || 0}
          max={element.data?.max || 100}
          label={element.label}
          className={element.style?.className}
        />
      );

    case 'chart':
      return (
        <Chart
          data={element.data}
          type={element.data?.type || 'bar'}
          className={element.style?.className}
        />
      );

    case 'timeline':
      return (
        <Timeline
          items={element.data?.items || []}
          className={element.style?.className}
        />
      );

    case 'card':
      if (element.id === 'company-grid') {
        return (
          <CompanyGrid
            companies={element.data?.companies || []}
            displayedCount={element.data?.displayedCount || 10}
            showMoreButton={element.data?.showMoreButton || false}
            onShowMore={() => handleInteraction('show-more')}
          />
        );
      }
      return (
        <Card
          title={element.data?.title}
          content={element.data?.content}
          image={element.data?.image}
          actions={element.data?.actions}
          onAction={handleInteraction}
          className={element.style?.className}
        />
      );

    case 'selection':
      return (
        <Selection
          options={element.data?.options || []}
          selected={element.data?.selected}
          onChange={(value) => handleInteraction('select', value)}
          className={element.style?.className}
        />
      );

    case 'input':
      return (
        <Input
          label={element.label}
          value={element.data?.value || ''}
          onChange={(value) => handleInteraction('input', value)}
          type={element.data?.type || 'text'}
          placeholder={element.data?.placeholder}
          className={element.style?.className}
        />
      );

    default:
      return null;
  }
} 