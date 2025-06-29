import { tryCatch } from "@julian-i/try-error";

interface NumberValidationOptions {
  min?: number;
  max?: number;
  allowNegative?: boolean;
  allowZero?: boolean;
  allowInfinity?: boolean;
  allowNaN?: boolean;
}

const DEFAULT_OPTIONS: NumberValidationOptions = {
  min: -Number.MAX_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  allowNegative: true,
  allowZero: true,
  allowInfinity: false,
  allowNaN: false,
};

const isNumber = (
  num: number,
  options: NumberValidationOptions = DEFAULT_OPTIONS
) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check for null/undefined
  if (num == null) throw new Error("Number is required");

  // Check for non-number types
  if (typeof num !== "number") throw new Error("Type must be a number");

  // Check for NaN
  if (!opts.allowNaN && Number.isNaN(num)) {
    throw new Error("Number cannot be NaN");
  }
  // If allowNaN is true and num is NaN, skip further checks
  if (opts.allowNaN && Number.isNaN(num)) return;

  // Check for Infinity
  if (!opts.allowInfinity && !Number.isFinite(num)) {
    throw new Error("Number cannot be Infinity or -Infinity");
  }
  // If allowInfinity is true and num is Infinity or -Infinity, skip further checks
  if (opts.allowInfinity && !Number.isFinite(num)) return;

  // Check for zero
  if (!opts.allowZero && num === 0) {
    throw new Error("Number cannot be zero");
  }

  // Check for negative numbers
  if (!opts.allowNegative && num < 0) {
    throw new Error("Number cannot be negative");
  }

  // Check minimum value
  if (opts.min !== undefined && num < opts.min) {
    throw new Error(
      `Number (${num}) is less than minimum allowed value (${opts.min})`
    );
  }

  // Check maximum value
  if (opts.max !== undefined && num > opts.max) {
    throw new Error(
      `Number (${num}) is greater than maximum allowed value (${opts.max})`
    );
  }
};

// Basic validation and conversion
export const isInteger = (num: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(num, options);
    if (Number.isNaN(num) || !Number.isFinite(num)) return false;
    return Number.isInteger(num);
  });

export const isPositive = (num: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(num, options);
    return num > 0;
  });

export const isNegative = (num: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(num, options);
    return num < 0;
  });

export const isEven = (num: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(num, options);
    return num % 2 === 0;
  });

export const isOdd = (num: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(num, options);
    return num % 2 !== 0;
  });

// Mathematical operations with validation
export const clamp = (
  num: number,
  min: number,
  max: number,
  options?: NumberValidationOptions
) =>
  tryCatch(() => {
    isNumber(num, options);
    isNumber(min, options);
    isNumber(max, options);

    if (min > max)
      throw new Error("Minimum value cannot be greater than maximum value");

    return Math.min(Math.max(num, min), max);
  });

export const round = (
  num: number,
  decimals: number = 0,
  options?: NumberValidationOptions
) =>
  tryCatch(() => {
    isNumber(num, options);
    if (!Number.isInteger(decimals) || decimals < 0) {
      throw new Error("Decimals must be a non-negative integer");
    }

    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  });

export const floor = (num: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(num, options);
    return Math.floor(num);
  });

export const ceil = (num: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(num, options);
    return Math.ceil(num);
  });

export const abs = (num: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(num, options);
    return Math.abs(num);
  });

// Number formatting and conversion
export const formatNumber = (
  num: number,
  locale: string = "en-US",
  options?: Intl.NumberFormatOptions
) =>
  tryCatch(() => {
    isNumber(num);
    if (typeof locale !== "string") throw new Error("Locale must be a string");

    try {
      return new Intl.NumberFormat(locale, options).format(num);
    } catch (err) {
      throw new Error(
        `Invalid locale or formatting options: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  });

export const formatCurrency = (
  num: number,
  currency: string = "USD",
  locale: string = "en-US"
) =>
  tryCatch(() => {
    isNumber(num);
    if (typeof currency !== "string")
      throw new Error("Currency must be a string");
    if (typeof locale !== "string") throw new Error("Locale must be a string");

    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(num);
    } catch (err) {
      throw new Error(
        `Invalid currency or locale: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  });

export const formatPercent = (
  num: number,
  decimals: number = 2,
  locale: string = "en-US"
) =>
  tryCatch(() => {
    isNumber(num);
    if (!Number.isInteger(decimals) || decimals < 0) {
      throw new Error("Decimals must be a non-negative integer");
    }
    if (typeof locale !== "string") throw new Error("Locale must be a string");

    try {
      return new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num / 100);
    } catch (err) {
      throw new Error(
        `Invalid locale: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  });

// Utility functions
export const random = (
  min: number = 0,
  max: number = 1,
  options?: NumberValidationOptions
) =>
  tryCatch(() => {
    isNumber(min, options);
    isNumber(max, options);

    if (min > max)
      throw new Error("Minimum value cannot be greater than maximum value");

    return Math.random() * (max - min) + min;
  });

export const randomInt = (
  min: number,
  max: number,
  options?: NumberValidationOptions
) =>
  tryCatch(() => {
    isNumber(min, options);
    isNumber(max, options);

    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error("Both min and max must be integers");
    }

    if (min > max)
      throw new Error("Minimum value cannot be greater than maximum value");

    return Math.floor(Math.random() * (max - min + 1)) + min;
  });

export const factorial = (num: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(num, { ...options, allowNegative: false, allowZero: true });

    if (!Number.isInteger(num))
      throw new Error("Factorial is only defined for integers");
    if (num > 170)
      throw new Error("Factorial result would be too large (max: 170)");

    if (num === 0 || num === 1) return 1;

    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  });

export const fibonacci = (num: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(num, { ...options, allowNegative: false, allowZero: true });

    if (!Number.isInteger(num))
      throw new Error("Fibonacci is only defined for integers");
    if (num > 78)
      throw new Error("Fibonacci result would be too large (max: 78)");

    if (num <= 1) return num;

    let a = 0,
      b = 1;
    for (let i = 2; i <= num; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  });

export const isPrime = (num: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(num, { ...options, allowNegative: false, allowZero: false });

    if (!Number.isInteger(num))
      throw new Error("Prime check is only defined for integers");
    if (num === 1) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;

    const sqrt = Math.sqrt(num);
    for (let i = 3; i <= sqrt; i += 2) {
      if (num % i === 0) return false;
    }
    return true;
  });

export const gcd = (a: number, b: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(a, options);
    isNumber(b, options);

    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      throw new Error("GCD is only defined for integers");
    }

    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  });

export const lcm = (a: number, b: number, options?: NumberValidationOptions) =>
  tryCatch(() => {
    isNumber(a, options);
    isNumber(b, options);

    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      throw new Error("LCM is only defined for integers");
    }

    if (a === 0 || b === 0)
      throw new Error("LCM is not defined when one number is zero");

    const gcdResult = gcd(Math.abs(a), Math.abs(b));
    if (gcdResult[1]) throw gcdResult[1];

    return Math.abs(a * b) / gcdResult[0];
  });

// Array operations
export const sum = (numbers: number[], options?: NumberValidationOptions) =>
  tryCatch(() => {
    if (!Array.isArray(numbers)) throw new Error("Input must be an array");
    if (numbers.length === 0) throw new Error("Array cannot be empty");

    let total = 0;
    for (const num of numbers) {
      isNumber(num, options);
      total += num;
    }
    return total;
  });

export const average = (numbers: number[], options?: NumberValidationOptions) =>
  tryCatch(() => {
    if (!Array.isArray(numbers)) throw new Error("Input must be an array");
    if (numbers.length === 0) throw new Error("Array cannot be empty");

    const sumResult = sum(numbers, options);
    if (sumResult[1]) throw sumResult[1];

    return sumResult[0] / numbers.length;
  });

export const min = (numbers: number[], options?: NumberValidationOptions) =>
  tryCatch(() => {
    if (!Array.isArray(numbers)) throw new Error("Input must be an array");
    if (numbers.length === 0) throw new Error("Array cannot be empty");

    let minValue = numbers[0];
    for (const num of numbers) {
      isNumber(num, options);
      if (num < minValue) minValue = num;
    }
    return minValue;
  });

export const max = (numbers: number[], options?: NumberValidationOptions) =>
  tryCatch(() => {
    if (!Array.isArray(numbers)) throw new Error("Input must be an array");
    if (numbers.length === 0) throw new Error("Array cannot be empty");

    let maxValue = numbers[0];
    for (const num of numbers) {
      isNumber(num, options);
      if (num > maxValue) maxValue = num;
    }
    return maxValue;
  });

// Conversion utilities
export const toFixed = (
  num: number,
  decimals: number = 0,
  options?: NumberValidationOptions
) =>
  tryCatch(() => {
    isNumber(num, options);
    if (!Number.isInteger(decimals) || decimals < 0 || decimals > 20) {
      throw new Error("Decimals must be an integer between 0 and 20");
    }

    return num.toFixed(decimals);
  });

export const parseNumber = (str: string, options?: NumberValidationOptions) =>
  tryCatch(() => {
    if (typeof str !== "string") throw new Error("Input must be a string");
    if (str.trim().length === 0) throw new Error("String cannot be empty");

    const num = Number(str);
    if (Number.isNaN(num))
      throw new Error("String cannot be converted to a valid number");

    isNumber(num, options);
    return num;
  });
