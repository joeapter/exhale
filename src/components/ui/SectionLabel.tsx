import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

export default function SectionLabel({ children, className, light }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        className
      )}
    >
      <span
        className="block h-px w-6 shrink-0"
        style={{ background: light ? "rgba(228,216,201,0.6)" : "rgba(184,144,128,0.5)" }}
      />
      <span
        className={cn(
          "label-sm",
          light ? "text-[#C9BAA8]" : "text-[#B89080]"
        )}
      >
        {children}
      </span>
    </div>
  );
}
