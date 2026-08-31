import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-start gap-2 cursor-pointer rounded-md text-sm font-visual font-light  whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border  border bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary  ",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "border-transparent text-primary bg-transparent hover:bg-transparent  hover:text-primary hover:border-primary",
        link: " text-primary ",
        nav: " text-primary btnText underline-none hover:underline-none border-b border-b-primary  hover:bg-primary hover:text-primary-foreground transition-all ",
      },
      size: {
        default: "h-10   px-2 py-1 whitespace-nowrap  has-[>svg]:px-3 btnText ",
        xs: "h-6 gap-1  px-2.5 py-1 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 py-1 gap-1.5  px-2 text-sm has-[>svg]:px-2.5",
        lg: "h-10 lg:h-14 btnTextLG  px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6  [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        "nav-lg": "h-10 lg:h-14 btnTextLG px-0  hover:px-3 has-[>svg]:px-4",
        filter: "h-auto   has-[>svg]:px-4",
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
