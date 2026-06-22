import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "bg-accent text-accent-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        className,
      )}
      {...props}
    />
  );
}
