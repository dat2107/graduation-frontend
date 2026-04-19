import { sha256 } from 'js-sha256';
import dayjs from 'dayjs';
import { AnyObject } from '@/@types/common';

const isWhiteCharacter = (value: string) =>
  value === ' ' ||
  value === '\f' ||
  value === '\n' ||
  value === '\r' ||
  value === '\t' ||
  value === '\v' ||
  value === '\u00a0' ||
  value === '\u1680' ||
  value === '\u2000' ||
  value === '\u2001' ||
  value === '\u2002' ||
  value === '\u2003' ||
  value === '\u2004' ||
  value === '\u2005' ||
  value === '\u2006' ||
  value === '\u2007' ||
  value === '\u2008' ||
  value === '\u2009' ||
  value === '\u200a' ||
  value === '\u2028' ||
  value === '\u2029' ||
  value === '\u202f' ||
  value === '\u205f' ||
  value === '\u3000' ||
  value === '\ufeff';

const createShortcut = (text: string, limit: number) => {
  if (text.length > limit && text) {
    let ending = false;
    // eslint-disable-next-line no-plusplus
    for (let i = limit - 3; i > -1; --i) {
      if (isWhiteCharacter(text[i])) {
        ending = true;
      } else if (ending) {
        limit = i + 4;
        break;
      }
    }
    const part = text.substring(0, limit - 3);
    return `${part}...`;
  }
  return text;
};

const toCurrency = (value: number) =>
  value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
const encode = (value: string) => sha256(value).toString();

function arrayToObject(array: any[]) {
  let result: AnyObject = {};
  array.forEach((item) => {
    const key = item.displayKey;
    result = { ...result, [key]: item };
  });
  return result;
}

// export function arrrayToObject2<T>(array: T[], keys: keyof T) {
//   let result = {};
//   array.forEach((item) => {
//     const key = keys;
//     result = { ...result, [key]: item };
//   });
//   console.log('result', result);
//   return result;
// }
// interface TProps {
//   displayKey: string;
//   displayValue: string;
//   displayA?: string;
// }
// const testData = [
//   {
//     displayKey: 'keyTest',
//     displayValue: 'valueTest',
//   },
// ];
// arrrayToObject2<TProps>(testData, 'displayKey');

const getGreetings = () => {
  const hour = dayjs().hour();
  if (hour < 10) {
    return 'Chúc buổi sáng vui vẻ,';
  }
  if (hour < 14) {
    return 'Chúc buổi trưa vui vẻ,';
  }
  if (hour < 18) {
    return 'Chúc buổi chiều vui vẻ,';
  }
  return 'Chúc buổi tối vui vẻ,';
};
export { createShortcut, toCurrency, encode, arrayToObject, getGreetings };
