import Image from 'next/image';
import { cn } from '@/lib/utils';
import observeXLogo from '@/assets/observeX.jpeg';

export function ObserveXLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center overflow-hidden rounded-md bg-black',
        className
      )}
    >
      <Image
        src={observeXLogo}
        alt="observeX"
        priority
        className="h-full w-auto object-contain"
        style={{ height: '100%', width: 'auto' }}
      />
    </div>
  );
}
