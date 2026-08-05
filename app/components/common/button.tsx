interface btnProps {
  buttonText: string;
  className?: string;
  varient?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

export const Button = ({
  buttonText,
  className,
  varient,
  disabled,
  type,
  onClick,
}: btnProps) => {
  let btnClass = "";

  if (varient === "primary") {
    btnClass =
      "button-primary text-primary cursor-pointer text-sm font-bold hover:bg-white disabled:cursor-not-allowed disabled:opacity-50";
  } else if (varient === "secondary") {
    btnClass =
      "button-secondary cursor-pointer text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50";
  }

  const baseClass = `text-sm font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className ?? "text-white"}`;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={btnClass !== "" ? btnClass : baseClass}
    >
      {buttonText}
    </button>
  );
};
