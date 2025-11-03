//src/lib/modular/headless/SearchBoxHeadless.tsx
import React from 'react';

export interface SearchBoxHeadlessProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  error: string | null;
  disabled?: boolean;
  placeholder?: string;
  children: (props: {
    inputProps: {
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
      disabled: boolean;
      placeholder: string;
    };
    clearButtonProps: {
      onClick: () => void;
      disabled: boolean;
    };
    submitButtonProps: {
      onClick: () => void;
      disabled: boolean;
    };
    state: {
      hasValue: boolean;
      hasError: boolean;
      error: string | null;
    };
  }) => React.ReactNode;
}

export function SearchBoxHeadless({
  value,
  onChange,
  onSubmit,
  onClear,
  error,
  disabled = false,
  placeholder = 'Buscar...',
  children,
}: SearchBoxHeadlessProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit && !disabled) {
      onSubmit();
    }
  };

  const handleClear = () => {
    if (onClear && !disabled) {
      onClear();
    }
  };

  const handleSubmit = () => {
    if (onSubmit && !disabled) {
      onSubmit();
    }
  };

  return (
    <>
      {children({
        inputProps: {
          value,
          onChange: (e) => onChange(e.target.value),
          onKeyDown: handleKeyDown,
          disabled,
          placeholder,
        },
        clearButtonProps: {
          onClick: handleClear,
          disabled,
        },
        submitButtonProps: {
          onClick: handleSubmit,
          disabled,
        },
        state: {
          hasValue: value.length > 0,
          hasError: !!error,
          error,
        },
      })}
    </>
  );
}