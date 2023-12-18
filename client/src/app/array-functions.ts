export const filter = ([first, ...rest]: any[], fn: (x: any) => boolean): any[] => {
    if(!first) return [];

    if(fn(first)){
        return [first, ...filter(rest, fn)]
    }

    return [...filter(rest, fn)];
}