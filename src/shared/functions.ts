import logger from './logger';

export const pErr = (err: Error) => {
    if (err) {
        logger.error(err);
    }
};

export const getRandomInt = () => {
    return Math.floor(Math.random() * 100);
};

export const getRandomFixedNumbers = (length: number): string => {
    const add = 1;
    let max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

    if (length > max) {
        return getRandomFixedNumbers(max) + getRandomFixedNumbers(length - max);
    }

    max = Math.pow(10, length + add);
    const min = max / 10; // Math.pow(10, n) basically
    const nb = Math.floor(Math.random() * (max - min + 1)) + min;

    return ('' + nb).substring(add);
}