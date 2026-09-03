import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "neu-pressed flex h-11 w-full rounded-full px-5 py-2 text-base text-[#374151] transition-shadow file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}

        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
