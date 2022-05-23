import { isNullOrUndefined } from 'util';

export const mapOrder = (
    array: any[],
    order: string | string[],
    key: string | number
) => {
    array.sort(function sortFunction(a, b) {
        const A = a[key];
        const B = b[key];

        if (order.indexOf(`${A}`) > order.indexOf(`${B}`)) {
            return 1;
        }
        return -1;
    });
    return array;
};

export const isEmptyArray = (obj: any) => {
    return obj === [] || obj.length === 0;
};

export const isUndefined = (obj: any) => {
    return obj === null || obj === undefined;
};

export const isEmpty = (obj: string) => {
    if (typeof obj === 'string') {
        return obj.trim() === '';
    }
    return obj === '';
};

export const isNothing = (obj: any) => {

    return isEmpty(obj) || isUndefined(obj);
};

export const isInvalidDate = (obj: any) => {
    return isNothing(obj) || obj === 'Invalid Date';
};

export const convertToEnglishNumbers = (str: string) => {
    const persianNumbers = [
        /۰/g,
        /۱/g,
        /۲/g,
        /۳/g,
        /۴/g,
        /۵/g,
        /۶/g,
        /۷/g,
        /۸/g,
        /۹/g,
    ];
    const arabicNumbers = [
        /٠/g,
        /١/g,
        /٢/g,
        /٣/g,
        /٤/g,
        /٥/g,
        /٦/g,
        /٧/g,
        /٨/g,
        /٩/g,
    ];
    const englishNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    if (isNothing(str)) return str;
    // eslint-disable-next-line no-restricted-syntax
    for (const i of englishNumbers) {
        const englishNum = i.toString();
        // eslint-disable-next-line no-param-reassign
        str = str
            .replace(persianNumbers[i], englishNum)
            .replace(arabicNumbers[i], englishNum);
    }
    return str;
};
export const EnsureNotSlashAtEnd = (url: string): string => {
    const lastIndex = url.lastIndexOf('/');
    if (lastIndex !== 1) {
        return url.slice(0, lastIndex);
    }
    return url;
};
export const getBooleanValue = (val: string): boolean => {
    if (val){
        if (val.toLowerCase() === 'true' || val.toString() === '1')
            return (true);
    }
    return (false);
};
