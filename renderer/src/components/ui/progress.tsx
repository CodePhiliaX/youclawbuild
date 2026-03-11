import * as React from "react";
import { cn } from "../../lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-full h-1 bg-gray-200 dark:bg-[#2a2a4a] rounded-sm overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-[#6c63ff] rounded-sm transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  )
);
Progress.displayName = "Progress";

export { Progress };
