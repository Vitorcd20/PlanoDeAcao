/* eslint-disable react-refresh/only-export-components */
import { cva, type VariantProps } from "class-variance-authority";
import Icon from "./icon";
import Text from "./text";
import SpinnerIcon from "../../assets/icons/spinner.svg?react";

export const buttonVariants = cva(
  `
    flex items-center justify-center cursor-pointer
    transition-all duration-200 ease-in-out rounded-lg group gap-2
    focus:outline-none focus:ring-4
  `,
  {
    variants: {
      variant: {
        primary: "bg-gray-200 hover:bg-pink-light",
        save: `
          bg-gradient-to-r from-blue-600 to-blue-700 
          hover:from-blue-700 hover:to-blue-800
          text-white font-semibold
          hover:scale-[1.02] hover:shadow-lg
          active:scale-[0.98]
          focus:ring-blue-300
          disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
        `,
        success: `
          bg-gradient-to-r from-green-600 to-green-700 
          hover:from-green-700 hover:to-green-800
          text-white font-semibold
          hover:scale-[1.02] hover:shadow-lg
          active:scale-[0.98]
          focus:ring-green-300
          disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
        `,
        danger: `
          bg-gradient-to-r from-red-600 to-red-700 
          hover:from-red-700 hover:to-red-800
          text-white font-semibold
          hover:scale-[1.02] hover:shadow-lg
          active:scale-[0.98]
          focus:ring-red-300
          disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
        `,
      },
      size: {
        md: "h-14 py-4 px-5",
        lg: "h-12 py-3 px-6", 
      },
      disabled: {
        true: "opacity-50 pointer-events-none",
      },
      handling: {
        true: "pointer-events-none animate-pulse",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      disabled: false,
      handling: false,
    },
  }
);

export const buttonIconVariants = cva("transition", {
  variants: {
    variant: {
      primary: "fill-pink-base",
      save: "fill-white",
      success: "fill-white",
      danger: "fill-white",
    },
    size: {
      md: "w-5 h-5",
      lg: "w-4 h-4",
    },
    handling: {
      true: "animate-spin",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    handling: false,
  },
});

export const buttonTextVariants = cva("", {
  variants: {
    variant: {
      primary: "text-gray-400",
      save: "text-white",
      success: "text-white", 
      danger: "text-white",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface ButtonProps
  extends Omit<React.ComponentProps<"button">, "size" | "disabled">,
    VariantProps<typeof buttonVariants> {
  icon?: React.ComponentProps<typeof Icon>["svg"];
  handling?: boolean;
}

export default function Button({
  variant,
  size,
  disabled,
  className,
  children,
  handling,
  icon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({
        className,
        disabled,
        size,
        variant,
        handling,
      })}
      disabled={disabled || handling}
      {...props}
    >
      {icon && (
        <Icon
          svg={handling ? SpinnerIcon : icon}
          className={buttonIconVariants({ variant, size, handling })}
        />
      )}
      <Text variant="body-md-bold" className={buttonTextVariants({ variant })}>
        {children}
      </Text>
    </button>
  );
}