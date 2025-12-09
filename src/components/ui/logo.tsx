import { Heart, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-xl' },
    lg: { icon: 40, text: 'text-3xl' },
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className="gradient-primary p-2 rounded-xl">
          <Pill className="text-primary-foreground" size={sizes[size].icon} />
        </div>
        <Heart 
          className="absolute -bottom-1 -right-1 text-accent fill-accent" 
          size={sizes[size].icon * 0.5} 
        />
      </div>
      {showText && (
        <span className={cn('font-display font-bold text-foreground', sizes[size].text)}>
          Medi<span className="text-primary">Share</span>
        </span>
      )}
    </div>
  );
}