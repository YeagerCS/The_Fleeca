export const currency = (value: number) => {
    return new Intl.NumberFormat('de-ch', {
        style: "currency",
        currency: "CHF"
    }).format(value);
}