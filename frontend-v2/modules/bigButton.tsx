function bigButton(
  color: string,
  width: string,
  text: string,
  glow: boolean,
  classNames: string,
  onClick: any
) {
  return (
    <button
      className={`
            relative
            px-8 py-3
            rounded-xl
            font-semibold
            text-${colorClasses[color]}-400
            border border-${colorClasses[color]}-500/40
            bg-${colorClasses[color]}-500/5
            backdrop-blur
            transition-all duration-300 ease-out
            hover:text-white
            hover:bg-${colorClasses[color]}-500/20
            hover:border-${colorClasses[color]}-400
            ${glow ? glowClasses[color] : null}
            focus:outline-none
            focus:ring-2 focus:ring-${colorClasses[color]}-500/50 ${
        widthClasses[width]
      }
            cursor-pointer
            ${classNames}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

const colorClasses: Record<string, string> = {
  blue: `
    text-blue-400
    border-blue-500/40
    bg-blue-500/5
    hover:bg-blue-500/20
    hover:border-blue-400
    focus:ring-blue-500/50
  `,
  red: `
    text-red-400
    border-red-500/40
    bg-red-500/5
    hover:bg-red-500/20
    hover:border-red-400
    focus:ring-red-500/50
  `,
  green: `
    text-green-400
    border-green-500/40
    bg-green-500/5
    hover:bg-green-500/20
    hover:border-green-400
    focus:ring-green-500/50
  `,
};

const glowClasses: Record<string, string> = {
  blue: "hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.6)]",
  red: "hover:shadow-[0_0_25px_-5px_rgba(239,68,68,0.6)]",
  green: "hover:shadow-[0_0_25px_-5px_rgba(34,197,94,0.6)]",
};

const widthClasses: Record<string, string> = {
  sm: "w-32",
  md: "w-48",
  lg: "w-64",
  full: "w-full",
};

export const bButton = bigButton;
