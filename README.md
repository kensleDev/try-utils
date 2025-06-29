# @julian-i/utils

A comprehensive collection of utility functions with robust error handling, built with TypeScript and inspired by functional programming principles.

## Features

- **Comprehensive Error Handling**: All utilities use tuple-based error handling with `[result, error]` pattern
- **TypeScript First**: Full TypeScript support with excellent type inference
- **Zero Dependencies**: Minimal external dependencies for maximum compatibility
- **Extensive Testing**: Thorough test coverage for all edge cases and error scenarios
- **Modular Design**: Import only what you need to keep bundle size minimal

## Installation

```bash
npm install @julian-i/utils
```

## Usage

### String Utilities

```typescript
import { capitalize, camelCase, snakeCase, truncate } from "@julian-i/utils";

// Basic usage
const [result, error] = capitalize("hello world");
if (error) {
  console.error("Error:", error.message);
} else {
  console.log(result); // "Hello world"
}

// Case conversion
const [camel, _] = camelCase("hello_world"); // "helloWorld"
const [snake, __] = snakeCase("helloWorld"); // "hello_world"

// Truncation with custom suffix
const [truncated, ___] = truncate("This is a very long string", 10, "...");
// "This is..."
```

### Number Utilities

```typescript
import {
  validateNumber,
  formatNumber,
  randomInt,
  factorial,
  isPrime,
} from "@julian-i/utils";

// Validation
const [num, error] = validateNumber("123", { min: 0, max: 1000 });
if (error) {
  console.error("Invalid number:", error.message);
}

// Formatting
const [formatted, _] = formatNumber(1234.56, {
  decimals: 2,
  currency: "USD",
}); // "$1,234.56"

// Math operations
const [fact, __] = factorial(5); // 120
const [isPrimeNum, ___] = isPrime(17); // true
const [random, ____] = randomInt(1, 100); // Random number between 1-100
```

### Fetch Utilities

```typescript
import { safeFetch } from "@julian-i/utils";

// Safe fetch with error handling
const [response, error] = await safeFetch("https://api.example.com/data");
if (error) {
  console.error("Fetch failed:", error.message);
} else {
  const data = await response.json();
  console.log(data);
}

// With custom options
const [result, _] = await safeFetch("https://api.example.com/post", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ key: "value" }),
});
```

## API Reference

### String Utilities

- `capitalize(str, options?)` - Capitalize first letter, lowercase rest
- `camelCase(str, options?)` - Convert to camelCase
- `snakeCase(str, options?)` - Convert to snake_case
- `kebabCase(str, options?)` - Convert to kebab-case
- `pascalCase(str, options?)` - Convert to PascalCase
- `titleCase(str, options?)` - Convert to Title Case
- `truncate(str, maxLength, suffix?, options?)` - Truncate string with suffix
- `reverse(str, options?)` - Reverse string
- `countWords(str, options?)` - Count words in string
- `removeExtraSpaces(str, options?)` - Remove extra whitespace
- `isPalindrome(str, options?)` - Check if string is palindrome

### Number Utilities

- `validateNumber(value, options?)` - Validate and parse number
- `formatNumber(num, options?)` - Format number with locale/currency
- `randomInt(min, max)` - Generate random integer
- `randomFloat(min, max, decimals?)` - Generate random float
- `factorial(n)` - Calculate factorial
- `fibonacci(n)` - Generate Fibonacci sequence
- `isPrime(n)` - Check if number is prime
- `gcd(a, b)` - Greatest common divisor
- `lcm(a, b)` - Least common multiple
- `sum(numbers)` - Sum array of numbers
- `average(numbers)` - Calculate average
- `min(numbers)` - Find minimum value
- `max(numbers)` - Find maximum value
- `clamp(value, min, max)` - Clamp value between min and max
- `roundToDecimal(num, decimals)` - Round to specific decimal places

### Fetch Utilities

- `safeFetch(url, options?)` - Safe fetch with error handling

## Error Handling

All utilities return a tuple `[result, error]` where:

- `result` is the successful value (or `null` if error)
- `error` is an Error object (or `null` if successful)

```typescript
const [result, error] = someUtility(input);

if (error) {
  // Handle error
  console.error(error.message);
} else {
  // Use result
  console.log(result);
}
```

## Validation Options

### String Validation

```typescript
interface StringValidationOptions {
  maxLength?: number; // Maximum string length
  allowWhitespaceOnly?: boolean; // Allow strings with only whitespace
  allowSpecialChars?: boolean; // Allow special characters
}
```

### Number Validation

```typescript
interface NumberValidationOptions {
  min?: number; // Minimum value
  max?: number; // Maximum value
  allowDecimals?: boolean; // Allow decimal numbers
  allowNegative?: boolean; // Allow negative numbers
  allowZero?: boolean; // Allow zero
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests: `bun run test:run`
6. Submit a pull request

## License

MIT
