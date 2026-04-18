import { cn } from "../libs/utils";

interface Field {
  label: string;
  id: string;
}

interface TagProps {
  field: Field;
  className?: string;
  children?: React.ReactNode;
}

function Tag({ field, className, children }: TagProps) {
  const scrollToField = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      element.classList.add(
        "ring-2",
        "ring-primary",
        "transition-all",
        "duration-500",
      );
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-primary");
      }, 2000);
    }
  };

  return (
    <div
      onClick={() => scrollToField(field.id)}
      className={cn(
        // Style mặc định: sử dụng màu Info từ palette (#065a82)
        "group cursor-pointer flex items-center gap-1 rounded px-2 py-0.5",
        "bg-info/10 text-info border border-info/20",
        "text-[10px] font-bold uppercase tracking-tight",
        "transition-all duration-200 active:scale-95",
        "hover:bg-info hover:text-white", // Hover effect
        className,
      )}
    >
      {children || field.label}
    </div>
  );
}

export { Tag, type Field };
