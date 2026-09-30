import { icons, LoaderIcon } from 'lucide-react';

interface DynamicIconProps {
    name?: string;
    color?: string;
    size?: number;
}

const DynamicIcon = ({ name, color, size }: DynamicIconProps) => {

    if (!name) {
        return <LoaderIcon color={color} size={size ?? 16} />; // Fallback icon
    }

    // Convert kebab-case or snake_case to PascalCase
    const pascalCaseName = name
        .toLowerCase()
        .split(/[-_\s]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

    const IconComponent = icons[pascalCaseName as keyof typeof icons];

    if (!IconComponent) {
        return <LoaderIcon color={color} size={size ?? 16} />; // Fallback icon
    }

    return <IconComponent color={color} size={size ?? 16} />;
};

export default DynamicIcon;