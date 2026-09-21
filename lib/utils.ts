export { cn } from "cn"


export const formatNumbers = (number: string|number, local: string): string => {
    const formatter = new Intl.NumberFormat('en-US');

    const formatted = formatter.format(Number(number))

    return formatted
}