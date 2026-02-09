import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { OptionalTag } from "./optional-tag";
import { cn } from "#/utils/utils";

interface SettingsDropdownInputProps {
  testId: string;
  name: string;
  items: { key: React.Key; label: string }[];
  label?: ReactNode;
  wrapperClassName?: string;
  placeholder?: string;
  showOptionalTag?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  defaultSelectedKey?: string;
  selectedKey?: string;
  isClearable?: boolean;
  allowsCustomValue?: boolean;
  required?: boolean;
  onSelectionChange?: (key: React.Key | null) => void;
  onInputChange?: (value: string) => void;
  defaultFilter?: (textValue: string, inputValue: string) => boolean;
  startContent?: ReactNode;
  inputWrapperClassName?: string;
  inputClassName?: string;
}

export function SettingsDropdownInput({
  testId,
  label,
  wrapperClassName,
  name,
  items,
  placeholder,
  showOptionalTag,
  isDisabled,
  isLoading,
  defaultSelectedKey,
  selectedKey,
  isClearable,
  allowsCustomValue,
  required,
  onSelectionChange,
  onInputChange,
  defaultFilter,
  startContent,
  inputWrapperClassName,
  inputClassName,
}: SettingsDropdownInputProps) {
  const { t } = useTranslation();

  return (
    <label className={cn("flex flex-col gap-2.5", wrapperClassName)}>
      {label && (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-zinc-200">{label}</span>
          {showOptionalTag && <OptionalTag />}
        </div>
      )}
      <Autocomplete
        aria-label={typeof label === "string" ? label : name}
        data-testid={testId}
        name={name}
        defaultItems={items}
        defaultSelectedKey={defaultSelectedKey}
        selectedKey={selectedKey}
        onSelectionChange={onSelectionChange}
        onInputChange={onInputChange}
        isClearable={isClearable}
        isDisabled={isDisabled || isLoading}
        isLoading={isLoading}
        placeholder={isLoading ? t("HOME$LOADING") : placeholder}
        allowsCustomValue={allowsCustomValue}
        isRequired={required}
        className="w-full"
        classNames={{
          popoverContent: "bg-zinc-900 rounded-lg border border-zinc-700",
        }}
        inputProps={{
          classNames: {
            inputWrapper: cn(
              "bg-zinc-900 border border-zinc-700 h-10 w-full rounded-lg px-3 py-2 hover:border-zinc-600 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/50 transition-all duration-200",
              inputWrapperClassName,
            ),
            input: cn(
              "text-zinc-100 placeholder:text-zinc-500",
              inputClassName,
            ),
          },
        }}
        defaultFilter={defaultFilter}
        startContent={startContent || null}
      >
        {(item) => (
          <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>
    </label>
  );
}
