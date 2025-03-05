import { cn } from "@/lib/utils";
import * as React from "react";

// import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { label?: string; error?: string }
>(({ className, ...props }, ref) => {
  return (
    <div>
      {props.label && (
        <label className="block text-sm font-medium ">{props.label}</label>
      )}
      <textarea
        className={cn(
          "flex min-h-[60px] max-h-[200px] h-auto w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
      {props.error && <p className="text-sm text-red-500">{props.error}</p>}
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
