import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  asChild?: boolean;
  children?: ReactNode;
}

export function Button({ className = '', variant = 'primary', asChild = false, ...props }: ButtonProps) {
  const baseStyles = 'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition';
  const variantStyles = variant === 'primary' 
    ? 'bg-violet text-white hover:bg-ocean disabled:cursor-not-allowed disabled:opacity-60'
    : 'bg-slate-100 text-ink hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60';
  
  const Element = asChild ? 'a' : 'button';
  
  return (
    <Element
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...(asChild ? {} : props)}
      {...(asChild ? props : {})}
    />
  );
}
