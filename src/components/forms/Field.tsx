"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Base = { label: string; error?: string | null; hint?: string; className?: string; inputClassName?: string; optionalLabel?: string };

export function TextField({
  label,
  error,
  hint,
  className,
  optionalLabel,
  inputClassName,
  multiline,
  ...input
}: Base & { multiline?: boolean } & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  const common = {
    id,
    "aria-invalid": !!error || undefined,
    "aria-describedby": describedBy,
    className: cn("input", inputClassName),
  };
  return (
    <div className={cn("field", className)}>
      <label htmlFor={id} className="field-label flex justify-between gap-2">
        <span>
          {label}
          {input.required && <span aria-hidden className="text-bronze"> *</span>}
        </span>
        {optionalLabel && <span className="normal-case tracking-normal text-taupe">{optionalLabel}</span>}
      </label>
      {multiline ? (
        <textarea {...(input as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} {...common} />
      ) : (
        <input {...(input as React.InputHTMLAttributes<HTMLInputElement>)} {...common} />
      )}
      {error ? (
        <p id={`${id}-err`} className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-mute">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({ label, error, className, children, ...select }: Base & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className={cn("field", className)}>
      <label htmlFor={id} className="field-label">
        {label}
        {select.required && <span aria-hidden className="text-bronze"> *</span>}
      </label>
      <select id={id} aria-invalid={!!error || undefined} aria-describedby={error ? `${id}-err` : undefined} {...select} className="input">
        {children}
      </select>
      {error && (
        <p id={`${id}-err`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
