import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

const InputField = ({
  name,
  label,
  type = "text",
  placeholder,
  disabled,
  value,
  register,
  validation,
  error,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form=label">
        {label}
      </Label>
      <Input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("form-input", {
          "opacity-50 cursor-not-allowed": disabled,
        })}
        {...register(name, validation)}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputField;
