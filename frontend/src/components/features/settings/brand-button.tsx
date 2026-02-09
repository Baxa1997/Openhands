import { cn } from "#/utils/utils";

interface BrandButtonProps {
  testId?: string;
  name?: string;
  variant: "primary" | "secondary" | "danger" | "ghost-danger";
  type: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  isDisabled?: boolean;
  className?: string;
  onClick?: () => void;
  startContent?: React.ReactNode;
}

export function BrandButton({
  testId,
  name,
  children,
  variant,
  type,
  isDisabled,
  className,
  onClick,
  startContent,
}: React.PropsWithChildren<BrandButtonProps>) {
  return (
    <button
      name={name}
      data-testid={testId}
      disabled={isDisabled}
      // The type is alreadt passed as a prop to the button component
      // eslint-disable-next-line react/button-has-type
      type={type}
      onClick={onClick}
      className={cn(
        "w-fit px-4 py-2 text-sm rounded-lg font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer",
        variant === "primary" &&
          "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20",
        variant === "secondary" &&
          "border border-blue-600 text-blue-500 hover:bg-blue-600/10",
        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20",
        variant === "ghost-danger" &&
          "bg-transparent text-red-500 underline hover:text-red-400 hover:no-underline font-medium",
        startContent && "flex items-center justify-center gap-2",
        className,
      )}
    >
      {startContent}
      {children}
    </button>
  );
}
