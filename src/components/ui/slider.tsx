"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const sliderVariants = cva("relative flex w-full touch-none select-none items-center", {
  variants: {
    variant: {
      default: "",
      warning: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const trackVariants = cva("relative h-2 w-full grow overflow-hidden rounded-full", {
    variants: {
      variant: {
        default: "bg-secondary",
        warning: "bg-yellow-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const rangeVariants = cva("absolute h-full", {
  variants: {
    variant: {
      default: "bg-primary",
      warning: "bg-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const thumbVariants = cva(
  "block h-5 w-5 rounded-full border-2 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-primary",
        warning: "border-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderVariants> {}


const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, variant, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(sliderVariants({ variant, className }))}
    {...props}
  >
    <SliderPrimitive.Track className={cn(trackVariants({ variant }))}>
      <SliderPrimitive.Range className={cn(rangeVariants({ variant }))} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={cn(thumbVariants({ variant }))} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
