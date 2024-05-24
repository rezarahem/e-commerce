export const regExpArabicNumber = new RegExp(/[\u0660-\u0669]/, 'g');
export const regExpPersianNumber = new RegExp(/[\u06f0-\u06f9]/, 'g');
export const regExpEnglishNumber = new RegExp(/[\u0030-\u0039]/, 'g');

export const toPersianNumber = (value: string): string => {
  if (!value) return '';

  return value
    .replace(regExpArabicNumber, (c) => {
      return String.fromCharCode(
        parseInt((c.charCodeAt(0) - 0x0660) as any, 10) + 0x06f0,
      );
    })
    .replace(regExpEnglishNumber, (c) => {
      return String.fromCharCode(parseInt(c, 10) + 0x06f0);
    });
};

export const toEnglishNumber = (value: string): string => {
  if (!value) return '';

  return value
    .replace(regExpArabicNumber, (c) => {
      return (c.charCodeAt(0) - 0x0660) as any;
    })
    .replace(regExpPersianNumber, (c) => {
      return (c.charCodeAt(0) - 0x06f0) as any;
    });
};

export const removeComma = (value: string) => {
  if (!value) return '';

  return value.replace(/,/g, '');
};

export const addCommaAndRetuenPersianStringNumber = (value: string) => {
  if (!value) return '';

  const enString = toEnglishNumber(value);
  const enStringWithComma = enString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return toPersianNumber(enStringWithComma);
};

export const addCommaAndRetuenPersianStringNumberOnChange = (value: string) => {
  const valueWithoutComma = value.replace(/,/g, '');
  const turnToEnNumber = toEnglishNumber(valueWithoutComma);
  const addCommaToEnNumberValue = turnToEnNumber.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ',',
  );
  return toPersianNumber(addCommaToEnNumberValue);
};

export const calculateDiscountPercentageFromSpecialPrice = (
  price: number,
  specialPrice: number,
) => {
  // Discount Percentage = (Original price - Discounted price) / Original price × 100
  const dis = Math.abs(Math.ceil(((price - specialPrice) / price) * 100));

  return `٪ ${toPersianNumber(String(dis))}`;
};

export const calculateDiscountSpecialPriceFromPercentage = (
  price: number,
  percentage: number,
) => {
  const calculateRate = percentage / 100;

  return price - price * calculateRate;
};

export const phoneNumberWithSpaces = (value: string): string => {
  const p = '#### ### ####';
  let i = 0;
  return p.replace(/#/g, () => value[i++]);
};

export const millisecondsToSecondsDifference = (
  timestamp1: number,
  timestamp2: number,
): number => {
  const differenceInMilliseconds = Math.abs(timestamp1 - timestamp2);
  const differenceInSeconds = differenceInMilliseconds / 1000;

  return Math.round(differenceInSeconds);
};

export const generateRandomUniqueString = (length: number) => {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const cryptoObj = window.crypto || (window as any).msCrypto; // for IE 11

  if (cryptoObj && cryptoObj.getRandomValues) {
    const randomValues = new Uint8Array(length);
    cryptoObj.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += charset.charAt(randomValues[i] % charset.length);
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }

  return result;
  // Example usage:
  // const uniqueString = generateRandomUniqueString(16);
  // console.log(uniqueString);
};
