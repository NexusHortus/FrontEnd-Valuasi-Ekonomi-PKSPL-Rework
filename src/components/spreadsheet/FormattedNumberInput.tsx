import React, { useState, useEffect } from 'react';
import { formatNumber, parseIndonesianNumber } from '../../utils/formatter';

interface FormattedNumberInputProps {
  value: number | null | undefined;
  onChange: (val: number | null) => void;
  placeholder?: string;
  decimals?: number;
  isIntegerOnly?: boolean;
  className?: string;
  title?: string;
}

export const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
  value,
  onChange,
  placeholder = '0',
  decimals = 2,
  isIntegerOnly = false,
  className = '',
  title
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localText, setLocalText] = useState('');

  // Synchronize localText when value changes from outside while not focused
  useEffect(() => {
    if (!isFocused) {
      if (value !== null && value !== undefined && !isNaN(value)) {
        setLocalText(formatNumber(value, isIntegerOnly ? 0 : decimals));
      } else {
        setLocalText('');
      }
    }
  }, [value, isFocused, decimals, isIntegerOnly]);

  const handleFocus = () => {
    setIsFocused(true);
    if (value !== null && value !== undefined && !isNaN(value)) {
      setLocalText(formatNumber(value, isIntegerOnly ? 0 : decimals));
    } else {
      setLocalText('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setLocalText(text);

    if (text.trim() === '') {
      onChange(null);
      return;
    }

    const parsed = parseIndonesianNumber(text);
    if (parsed !== null && !isNaN(parsed)) {
      onChange(isIntegerOnly ? Math.round(parsed) : parsed);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (localText.trim() === '') {
      onChange(null);
      setLocalText('');
      return;
    }

    const parsed = parseIndonesianNumber(localText);
    if (parsed !== null && !isNaN(parsed)) {
      const finalVal = isIntegerOnly ? Math.round(parsed) : parsed;
      onChange(finalVal);
      setLocalText(formatNumber(finalVal, isIntegerOnly ? 0 : decimals));
    } else {
      // Revert if invalid
      if (value !== null && value !== undefined && !isNaN(value)) {
        setLocalText(formatNumber(value, isIntegerOnly ? 0 : decimals));
      } else {
        setLocalText('');
        onChange(null);
      }
    }
  };

  const displayVal = isFocused
    ? localText
    : (value !== null && value !== undefined && !isNaN(value))
      ? formatNumber(value, isIntegerOnly ? 0 : decimals)
      : '';

  return (
    <input
      type="text"
      inputMode="decimal"
      value={displayVal}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      title={title}
    />
  );
};
