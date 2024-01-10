/**
import { str } from 'envalid';
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const getWordsFromString = (input: string) => {
  return input.match(/\b(\w+)\b/g) ?? [];
};

export const getFirstWords = (input: string, numberOfWords: number): string => {
  const words: string[] = input.match(/\S+\s*/g);

  if (!words || words.length < numberOfWords) {
    return input;
  }

  const result = words.slice(0, numberOfWords).join('');
  return result;
};

export const getNumberOfWordsInString = (input: string): number => {
  const words: string[] | boolean = input.match(/\S+\s*/g);
  if (Array.isArray(words)) return words.length;
  return 0;
};
