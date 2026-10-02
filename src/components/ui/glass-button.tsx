import * as React from "react";

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "icon";
  asChild?: boolean;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95";
    
    const variants = {
      primary: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] font-medium px-8 py-3 tracking-widest uppercase text-sm",
      secondary: "bg-transparent border border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 tracking-widest uppercase text-sm",
      icon: "p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 backdrop-blur-md text-white transition-all shadow-sm"
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
GlassButton.displayName = "GlassButton";
