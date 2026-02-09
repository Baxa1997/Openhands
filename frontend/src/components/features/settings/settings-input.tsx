import { cn } from "#/utils/utils";
import { OptionalTag } from "./optional-tag";

interface SettingsInputProps {
  testId?: string;
  name?: string;
  label: string;
  type: React.HTMLInputTypeAttribute;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  showOptionalTag?: boolean;
  isDisabled?: boolean;
  startContent?: React.ReactNode;
  className?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  labelClassName?: string;
}

export function SettingsInput({
  testId,
  name,
  label,
  type,
  defaultValue,
  value,
  placeholder,
  showOptionalTag,
  isDisabled,
  startContent,
  className,
  onChange,
  required,
  min,
  max,
  step,
  pattern,
  labelClassName,
}: SettingsInputProps) {
  return (
    <label className={cn("flex flex-col gap-2.5 w-fit", className)}>
      <div className="flex items-center gap-2">
        {startContent}
        <span
          className={cn("text-sm font-medium text-zinc-200", labelClassName)}
        >
          {label}
        </span>
        {showOptionalTag && <OptionalTag />}
      </div>
      <input
        data-testid={testId}
        onChange={(e) => onChange && onChange(e.target.value)}
        name={name}
        disabled={isDisabled}
        type={type}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
        pattern={pattern}
        className={cn(
          "bg-zinc-900 border border-zinc-700 h-10 w-full rounded-lg px-3 py-2 text-zinc-100 placeholder:text-zinc-500 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600",
          "hover:border-zinc-600",
          "disabled:bg-zinc-900/50 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-600",
        )}
      />
    </label>
  );
}
