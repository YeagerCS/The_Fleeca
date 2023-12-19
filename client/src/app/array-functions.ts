export const filter = ([first, ...rest]: any[], fn: (x: any) => boolean): any[] => {
    if(!first) return [];

    if(fn(first)){
        return [first, ...filter(rest, fn)]
    }

    return [...filter(rest, fn)];
}

export const reduce = ([first, ...rest]: any[], fn: (acc: any, x: any) => any, initialValue: any): any => {
    if(!first) return initialValue;

    return reduce(rest, fn, fn(initialValue, first))
}

export const forEach = ([first, ...rest]: any[], fn: (x: any) => void): void => {
    if(!first) return;

    fn(first)
    forEach(rest, fn);
}