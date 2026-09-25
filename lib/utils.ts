export { cn } from "cn"


export const formatNumbers = (number?: string|number, local?: string): string => {
    const formatter = new Intl.NumberFormat("US-us");

    const formatted = formatter.format(Number(number))

    return formatted
}


export function capitalizeFirstLetter(str?: string) : string{
  if (!str) return ''; // Handles empty strings safely
  return str.charAt(0).toUpperCase() + str.slice(1);
}