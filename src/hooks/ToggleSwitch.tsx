// ToggleSwitch.tsx
import React from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <label
      className={`flex items-center gap-2 ${
        disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
      }`}
    >
      <span className="whitespace-nowrap">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 rounded-full transition ${
            checked
              ? disabled
                ? 'bg-blue-400' // atenuado mas visível
                : 'bg-blue-600'
              : 'bg-gray-300'
          }`}
        />
        <div
          className={`absolute left-0 top-0 w-6 h-6 bg-white border rounded-full shadow transition
            ${checked ? 'translate-x-full' : ''}
            ${
              disabled
                ? checked
                  ? 'border-blue-400'
                  : 'border-gray-200 bg-gray-100'
                : checked
                ? 'border-blue-600'
                : 'border-gray-300'
            }`}
        />
      </div>
    </label>
  );
};

export default ToggleSwitch;
