import { Trash, Pencil, Plus, Check } from "lucide-react"; // or any icon library you use
import type { ReactNode } from "react";

// Map icon names to actual React components
const icons: Record<string, ReactNode> = {
  trash: <Trash className="w-4 h-4" />,
  edit: <Pencil className="w-4 h-4" />,
  add: <Plus className="w-4 h-4" />,
  confirm: <Check className="w-4 h-4" />,
};

function iconButton(
  color: string,
  iconName: keyof typeof icons, // select from predefined icons
  glow: boolean,
  classNames: string,
  onClick: any,
) {
  const icon = icons[iconName]; // pick the icon

  return (
    <button
      onClick={onClick}
      className={`
        ml-3
        mb-3
        p-2
        text-sm
        rounded-md
        flex items-center justify-center
        transition-colors
        duration-150
        cursor-pointer
        ${colorClasses[color]}
        ${glow ? glowClasses[color] : ""}
        ${classNames}
      `}
    >
      {icon}
    </button>
  );
}

const colorClasses: Record<string, string> = {
  blue: `
    text-blue-400
    border border-blue-500/40
    bg-blue-500/5
    hover:bg-blue-500/20
    hover:text-blue-300
    hover:border-blue-400
    focus:ring-2 focus:ring-blue-500/50
  `,
  red: `
    text-red-400
    border border-red-500/40
    bg-red-500/5
    hover:bg-red-500/20
    hover:text-red-300
    hover:border-red-400
    focus:ring-2 focus:ring-red-500/50
  `,
  green: `
    text-green-400
    border border-green-500/40
    bg-green-500/5
    hover:bg-green-500/20
    hover:text-green-300
    hover:border-green-400
    focus:ring-2 focus:ring-green-500/50
  `,
};

const glowClasses: Record<string, string> = {
  blue: "hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.6)]",
  red: "hover:shadow-[0_0_25px_-5px_rgba(239,68,68,0.6)]",
  green: "hover:shadow-[0_0_25px_-5px_rgba(34,197,94,0.6)]",
};

export const iButton = iconButton;
