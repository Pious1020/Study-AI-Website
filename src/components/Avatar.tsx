import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'User'}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <div
      className={`${sizes[size]} rounded-full bg-apple-blue/10 flex items-center justify-center`}
    >
      {initials ? (
        <span className="text-apple-blue font-medium text-sm">
          {initials}
        </span>
      ) : (
        <User className="h-5 w-5 text-apple-blue" />
      )}
    </div>
  );
}
