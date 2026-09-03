import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import { usePixelCorners } from "@/app/hooks/usePixelCorners";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center  justify-center gap-2 cursor-pointer lowercase rounded-md text-sm font-visual font-normal tracking-wide  whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          " pixelCorners bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 pixelCorners",
        outline:
          "border pixelCorners  border bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary  ",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 pixelCorners",
        ghost:
          "border-transparent text-primary bg-transparent hover:bg-transparent  hover:text-primary hover:border-primary",
        link: " text-primary  justify-start border-transparent hover:border-b-primary  cursor-pointer ",
        nav: " text-primary btnText underline-none hover:underline-none border-b border-b-primary  hover:bg-primary hover:text-primary-foreground transition-all ",
      },
      size: {
        default: "h-10   px-2 py-1 whitespace-nowrap  has-[>svg]:px-3 btnText ",
        xs: "h-6 gap-1  px-2.5 py-1 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 py-1 gap-1.5  px-2 text-sm has-[>svg]:px-2.5",
        lg: "h-12 lg:h-16 text-base lg:text-xl  px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6  [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        "nav-lg": "h-10 lg:h-14 btnTextLG px-0  hover:px-3 has-[>svg]:px-4",
        filter: "h-auto   has-[>svg]:px-4",
        lgLink: "h-auto  text-3xl   has-[>svg]:px-4 ",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/** Sizes small enough that the default corner ratio looks over-pixelated —
 *  these get half the intensity. */
const SMALL_SIZES = new Set(["xs", "sm", "icon-xs", "icon-sm"]);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ref,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  // Scale the pixel-corner notches to the rendered button. Small buttons use a
  // gentler ratio so the corners don't eat the whole edge.
  const pixelRef = usePixelCorners<HTMLElement>(
    SMALL_SIZES.has(size ?? "")
      ? { ratio: 0.1, min: 2, max: 6 }
      : { ratio: 0.2, min: 4, max: 16 },
  );

  const setRef = React.useCallback(
    (node: HTMLElement | null) => {
      pixelRef.current = node;
      if (typeof ref === "function") ref(node as HTMLButtonElement | null);
      else if (ref) ref.current = node as HTMLButtonElement | null;
    },
    [pixelRef, ref],
  );

  return (
    <Comp
      ref={setRef}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
