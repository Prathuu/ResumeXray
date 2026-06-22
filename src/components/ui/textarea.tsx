import * as React from "react";

import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "bg-card-solid placeholder:text-muted-foreground focus:border-primary min-h-32 w-full resize-y rounded-xl border px-4 py-3 text-sm leading-6 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
