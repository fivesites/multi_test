import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 w-min  font-normal tracking-tight whitespace-nowrap transition-all outline-none font-rounded cursor-pointer focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "bg-transparent  hover:backdrop-blur-lg text-background hover:bg-foreground/10 hover:text-foreground/80 ",
        link: "text-red-200 [.no-glow_&]:text-neutral-400 no-underline hover:no-underline hover:text-red-100 hover:[text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] [.no-glow_&]:hover:text-red-500 [.no-glow_&]:hover:[text-shadow:none] transition-all duration-200",
        glow: "bg-transparent text-red-100 [text-shadow:0_0_4px_#fff,0_0_8px_#ef4444,0_0_20px_#ef4444,0_0_40px_#ef4444,0_0_80px_rgba(239,68,68,0.7)] [&_svg]:[filter:drop-shadow(0_0_4px_#fff)_drop-shadow(0_0_8px_#ef4444)_drop-shadow(0_0_20px_rgba(239,68,68,0.8))] [.no-glow_&]:text-red-500 [.no-glow_&]:[text-shadow:none] [.no-glow_&_svg]:[filter:none] [.no-glow_&]:hover:text-red-500 [.no-glow_&]:hover:[text-shadow:none]",
      },
      size: {
        default:
          "h-auto px-0 py-0 has-[>svg]:px-3 leading-tight tracking-normal text-base",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-[2rem] gap-1.5 px-3 has-[>svg]:px-2.5 text-sm",
        lg: "h-[4rem] lg:h-auto lg:py-4 text-xl lg:text-2xl rounded-md px-6 has-[>svg]:px-4 ",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
