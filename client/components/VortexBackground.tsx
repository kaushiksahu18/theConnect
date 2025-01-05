import { Vortex } from "@/components/ui/vortex";
import { cn } from "@/lib/utils";
import { memo } from "react";

function VortexBackground({ className }: { className?: string }) {
  return (
    <Vortex
      backgroundColor="black"
      className={cn(
        "flex h-full w-full flex-col items-center justify-center px-2 py-4 md:px-10",
        className,
      )}
    />
  );
}

export const MemoizedVortexBackground = memo(VortexBackground);
