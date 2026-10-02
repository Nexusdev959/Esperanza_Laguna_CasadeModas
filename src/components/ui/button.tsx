import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
    
    // Tailwind v4 uses --color-* for theme colors, we can map to the CSS vars directly
    const variants = {
      primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-md",
      secondary: "bg-[var(--secondary)] text-white hover:brightness-110 shadow-md",
      outline: "border border-[var(--border-color)] bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[var(--foreground)]",
      ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[var(--foreground)]",
    };
    
    const sizes = {
      sm: "h-9 px-4 text-xs tracking-wide",
      md: "h-11 px-6 py-2 text-sm tracking-wide",
      lg: "h-14 px-8 text-base tracking-wider",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    )
  }
);
Button.displayName = "Button";
