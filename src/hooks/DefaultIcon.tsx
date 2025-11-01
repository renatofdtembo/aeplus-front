import * as lucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

// Get all valid icon names
const iconNames = Object.keys(lucideIcons).filter(
  (key) => key[0] === key[0].toUpperCase()
) as Array<keyof typeof lucideIcons>;

export type IconName = typeof iconNames[number];

interface DefaultIconProps extends LucideProps {
  name: IconName | string; // Accept string but prefer IconName
}

export function DefaultIcon({ name, ...props }: DefaultIconProps) {
  // Type guard to ensure we have a valid icon
  const isValidIcon = iconNames.includes(name as IconName);
  const IconComponent: any = isValidIcon 
    ? lucideIcons[name as IconName] 
    : null;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return null;
  }

  return <IconComponent {...props} />;
}


// Lista formatada para uso em selects
export const iconOptions = iconNames.map(name => ({
  value: name,
  label: name,
}));