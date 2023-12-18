export const getFormattedCategory = (input: string) => {
    return (input[0].toUpperCase() + input.substring(1)).replace("_", " ");
}