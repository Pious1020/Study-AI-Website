import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  if (src) {
    return (
      <div className={`${sizes[size]} relative rounded-full bg-apple-gray-100 flex items-center justify-center overflow-hidden`}>
        <img
          src={src}
          alt={name || 'User'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
          }}
        />
        <div className="fallback hidden absolute inset-0 flex items-center justify-center bg-apple-blue/10">
          {name ? (
            <span className="text-apple-blue font-medium">
              {name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </span>
          ) : (
            <User className={`${iconSizes[size]} text-apple-blue`} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-apple-blue/10 flex items-center justify-center`}>
      {name ? (
        <span className="text-apple-blue font-medium">
          {name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </span>
      ) : (
        <User className={`${iconSizes[size]} text-apple-blue`} />
      )}
    </div>
  );
}
