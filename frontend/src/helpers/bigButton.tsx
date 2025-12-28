function bigButton(
  color: string,
  width: string,
  text: string,
  glow: boolean,
  onClick: any
) {
  return (
    <button
      className={`
            relative
            px-8 py-3
            rounded-xl
            font-semibold
            text-${color}-400
            border border-${color}-500/40
            bg-${color}-500/5
            backdrop-blur
            transition-all duration-300 ease-out
            hover:text-white
            hover:bg-${color}-500/20
            hover:border-${color}-400
            ${
              glow
                ? `
            hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.6)]`
                : null
            }
            focus:outline-none
            focus:ring-2 focus:ring-${color}-500/50 w-${width}
            cursor-pointer
            `}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default bigButton;
