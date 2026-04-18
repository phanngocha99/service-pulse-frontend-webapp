import { Asterisk } from "lucide-react";
import { cn } from "../libs/utils";
import { type Field, Tag } from "./Tag";

interface MandatoryGuideProps {
  fields: Field[];
  className?: string;
}

export function MandatoryGuide({
  fields = [],
  className,
}: MandatoryGuideProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-primary/10 bg-info-foreground/50 p-3 flex flex-col gap-3",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 shrink-0">
        <Asterisk className="text-destructive" size={14} strokeWidth={3} />
        <p className="text-xs font-semibold text-primary">
          Mandatory Field:{" "}
          <span className="text-muted-foreground font-medium">
            Click tags to jump to field
          </span>
        </p>
      </div>

      {fields.length > 0 && (
        <div className="flex flex-wrap gap-2 border-l-2 border-primary/20 pl-3">
          {fields.map((field) => (
            <Tag key={field.id} field={field}>
              {field.label}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
}
