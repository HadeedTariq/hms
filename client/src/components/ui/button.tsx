import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // New variants
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        info: "bg-blue-500 text-white hover:bg-blue-600",
        subtle: "text-foreground/80 hover:bg-accent/40 hover:text-foreground",
        accent: "bg-accent text-accent-foreground hover:bg-accent/80",
        gradient:
          "bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90",
        "outline-primary":
          "border-2 border-primary text-primary hover:bg-primary/10",
        "outline-destructive":
          "border-2 border-destructive text-destructive hover:bg-destructive/10",
        "ghost-primary": "text-primary hover:bg-primary/10",
        "ghost-destructive": "text-destructive hover:bg-destructive/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // New sizes
        xs: "h-7 rounded-md px-2 text-xs",
        xl: "h-14 rounded-md px-10 text-base",
        "2xl": "h-16 rounded-md px-12 text-lg",
        pill: "rounded-full",
        block: "w-full",
        compact: "h-8 px-2 py-1 text-xs",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        spin: "animate-spin",
      },
      elevation: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
