import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  const variantClass = variant === 'secondary'
    ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
    : 'bg-violet hover:bg-ocean text-white';
  
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClass} ${className}`}
      {...props}
    />
  );
}
