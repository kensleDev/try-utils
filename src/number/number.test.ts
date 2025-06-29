import { describe, expect, it } from "vitest";
import {
	abs,
	average,
	ceil,
	clamp,
	factorial,
	fibonacci,
	floor,
	formatCurrency,
	formatNumber,
	formatPercent,
	gcd,
	isEven,
	isInteger,
	isNegative,
	isOdd,
	isPositive,
	isPrime,
	lcm,
	max,
	min,
	parseNumber,
	random,
	randomInt,
	round,
	sum,
	toFixed,
} from "./index";

describe("Number Utils - Error Handling", () => {
	describe("Common validation errors", () => {
		it("should handle null values", () => {
			const result = isInteger(null as any);
			expect(result[1]?.message).toBe("Number is required");
		});

		it("should handle undefined values", () => {
			const result = isInteger(undefined as any);
			expect(result[1]?.message).toBe("Number is required");
		});

		it("should handle non-number types", () => {
			const result = isInteger("123" as any);
			expect(result[1]?.message).toBe("Type must be a number");
		});

		it("should handle NaN", () => {
			const result = isInteger(NaN);
			expect(result[1]?.message).toBe("Number cannot be NaN");
		});

		it("should handle Infinity", () => {
			const result = isInteger(Infinity);
			expect(result[1]?.message).toBe("Number cannot be Infinity or -Infinity");
		});

		it("should handle negative numbers when not allowed", () => {
			const result = isInteger(-5, { allowNegative: false });
			expect(result[1]?.message).toBe("Number cannot be negative");
		});

		it("should handle zero when not allowed", () => {
			const result = isInteger(0, { allowZero: false });
			expect(result[1]?.message).toBe("Number cannot be zero");
		});

		it("should handle numbers below minimum", () => {
			const result = isInteger(5, { min: 10 });
			expect(result[1]?.message).toContain("less than minimum allowed value");
		});

		it("should handle numbers above maximum", () => {
			const result = isInteger(15, { max: 10 });
			expect(result[1]?.message).toContain(
				"greater than maximum allowed value"
			);
		});
	});

	describe("Basic validation functions", () => {
		it("should check if number is integer", () => {
			expect(isInteger(5)[0]).toBe(true);
			expect(isInteger(5.5)[0]).toBe(false);
			expect(isInteger(0)[0]).toBe(true);
		});

		it("should check if number is positive", () => {
			expect(isPositive(5)[0]).toBe(true);
			expect(isPositive(-5)[0]).toBe(false);
			expect(isPositive(0)[0]).toBe(false);
		});

		it("should check if number is negative", () => {
			expect(isNegative(-5)[0]).toBe(true);
			expect(isNegative(5)[0]).toBe(false);
			expect(isNegative(0)[0]).toBe(false);
		});

		it("should check if number is even", () => {
			expect(isEven(2)[0]).toBe(true);
			expect(isEven(3)[0]).toBe(false);
			expect(isEven(0)[0]).toBe(true);
		});

		it("should check if number is odd", () => {
			expect(isOdd(3)[0]).toBe(true);
			expect(isOdd(2)[0]).toBe(false);
			expect(isOdd(0)[0]).toBe(false);
		});
	});

	describe("Mathematical operations", () => {
		it("should clamp numbers", () => {
			expect(clamp(5, 0, 10)[0]).toBe(5);
			expect(clamp(-5, 0, 10)[0]).toBe(0);
			expect(clamp(15, 0, 10)[0]).toBe(10);
		});

		it("should handle invalid clamp range", () => {
			const result = clamp(5, 10, 0);
			expect(result[1]?.message).toBe(
				"Minimum value cannot be greater than maximum value"
			);
		});

		it("should round numbers", () => {
			expect(round(3.14159, 2)[0]).toBe(3.14);
			expect(round(3.14159, 0)[0]).toBe(3);
			expect(round(3.5)[0]).toBe(4);
		});

		it("should handle invalid decimals for round", () => {
			const result = round(3.14, -1);
			expect(result[1]?.message).toBe(
				"Decimals must be a non-negative integer"
			);
		});

		it("should floor numbers", () => {
			expect(floor(3.7)[0]).toBe(3);
			expect(floor(-3.7)[0]).toBe(-4);
		});

		it("should ceil numbers", () => {
			expect(ceil(3.2)[0]).toBe(4);
			expect(ceil(-3.2)[0]).toBe(-3);
		});

		it("should get absolute value", () => {
			expect(abs(-5)[0]).toBe(5);
			expect(abs(5)[0]).toBe(5);
			expect(abs(0)[0]).toBe(0);
		});
	});

	describe("Formatting functions", () => {
		it("should format numbers", () => {
			expect(formatNumber(1234.56, "en-US")[0]).toBe("1,234.56");
			expect(formatNumber(1234.56, "de-DE")[0]).toBe("1.234,56");
		});

		it("should handle invalid locale", () => {
			const result = formatNumber(1234.56, "invalid-locale");
			if (result[1]) {
				expect(result[1]?.message).toContain("Invalid locale");
			} else {
				expect(typeof result[0]).toBe("string");
			}
		});

		it("should format currency", () => {
			expect(formatCurrency(1234.56, "USD")[0]).toBe("$1,234.56");
			const euroResult = formatCurrency(1234.56, "EUR", "de-DE");
			expect(euroResult[0]).toMatch(/1\.234,56\s*€/);
		});

		it("should handle invalid currency", () => {
			const result = formatCurrency(1234.56, "INVALID");
			expect(result[1]?.message).toContain("Invalid currency");
		});

		it("should format percentages", () => {
			expect(formatPercent(25.5)[0]).toBe("25.50%");
			expect(formatPercent(25.5, 1)[0]).toBe("25.5%");
		});

		it("should handle invalid decimals for percent", () => {
			const result = formatPercent(25.5, -1);
			expect(result[1]?.message).toBe(
				"Decimals must be a non-negative integer"
			);
		});
	});

	describe("Random functions", () => {
		it("should generate random numbers in range", () => {
			const result = random(1, 10);
			expect(result[0]).toBeGreaterThanOrEqual(1);
			expect(result[0]).toBeLessThan(10);
			expect(result[1]).toBe(null);
		});

		it("should handle invalid random range", () => {
			const result = random(10, 1);
			expect(result[1]?.message).toBe(
				"Minimum value cannot be greater than maximum value"
			);
		});

		it("should generate random integers", () => {
			const result = randomInt(1, 10);
			expect(Number.isInteger(result[0])).toBe(true);
			expect(result[0]).toBeGreaterThanOrEqual(1);
			expect(result[0]).toBeLessThanOrEqual(10);
			expect(result[1]).toBe(null);
		});

		it("should handle non-integer bounds", () => {
			const result = randomInt(1.5, 10);
			expect(result[1]?.message).toBe("Both min and max must be integers");
		});
	});

	describe("Mathematical sequences", () => {
		it("should calculate factorial", () => {
			expect(factorial(5)[0]).toBe(120);
			expect(factorial(0)[0]).toBe(1);
			expect(factorial(1)[0]).toBe(1);
		});

		it("should handle negative factorial", () => {
			const result = factorial(-5);
			expect(result[1]?.message).toBe("Number cannot be negative");
		});

		it("should handle non-integer factorial", () => {
			const result = factorial(5.5);
			expect(result[1]?.message).toBe("Factorial is only defined for integers");
		});

		it("should handle large factorial", () => {
			const result = factorial(171);
			expect(result[1]?.message).toBe(
				"Factorial result would be too large (max: 170)"
			);
		});

		it("should calculate fibonacci", () => {
			expect(fibonacci(0)[0]).toBe(0);
			expect(fibonacci(1)[0]).toBe(1);
			expect(fibonacci(5)[0]).toBe(5);
			expect(fibonacci(10)[0]).toBe(55);
		});

		it("should handle large fibonacci", () => {
			const result = fibonacci(79);
			expect(result[1]?.message).toBe(
				"Fibonacci result would be too large (max: 78)"
			);
		});

		it("should check if number is prime", () => {
			expect(isPrime(2)[0]).toBe(true);
			expect(isPrime(3)[0]).toBe(true);
			expect(isPrime(4)[0]).toBe(false);
			expect(isPrime(17)[0]).toBe(true);
		});

		it("should handle non-integer prime check", () => {
			const result = isPrime(5.5);
			expect(result[1]?.message).toBe(
				"Prime check is only defined for integers"
			);
		});

		it("should calculate GCD", () => {
			expect(gcd(48, 18)[0]).toBe(6);
			expect(gcd(0, 5)[0]).toBe(5);
			expect(gcd(5, 0)[0]).toBe(5);
		});

		it("should handle non-integer GCD", () => {
			const result = gcd(5.5, 10);
			expect(result[1]?.message).toBe("GCD is only defined for integers");
		});

		it("should calculate LCM", () => {
			expect(lcm(12, 18)[0]).toBe(36);
			expect(lcm(5, 7)[0]).toBe(35);
		});

		it("should handle zero in LCM", () => {
			const result = lcm(0, 5);
			expect(result[1]?.message).toBe(
				"LCM is not defined when one number is zero"
			);
		});
	});

	describe("Array operations", () => {
		it("should calculate sum", () => {
			expect(sum([1, 2, 3, 4, 5])[0]).toBe(15);
			expect(sum([-1, -2, 3])[0]).toBe(0);
		});

		it("should handle empty array for sum", () => {
			const result = sum([]);
			expect(result[1]?.message).toBe("Array cannot be empty");
		});

		it("should handle non-array for sum", () => {
			const result = sum("not an array" as any);
			expect(result[1]?.message).toBe("Input must be an array");
		});

		it("should calculate average", () => {
			expect(average([1, 2, 3, 4, 5])[0]).toBe(3);
			expect(average([0, 0, 0])[0]).toBe(0);
		});

		it("should find minimum", () => {
			expect(min([3, 1, 4, 1, 5])[0]).toBe(1);
			expect(min([-5, -10, -1])[0]).toBe(-10);
		});

		it("should find maximum", () => {
			expect(max([3, 1, 4, 1, 5])[0]).toBe(5);
			expect(max([-5, -10, -1])[0]).toBe(-1);
		});
	});

	describe("Conversion utilities", () => {
		it("should convert to fixed decimal string", () => {
			expect(toFixed(3.14159, 2)[0]).toBe("3.14");
			expect(toFixed(3.14159, 0)[0]).toBe("3");
		});

		it("should handle invalid decimals for toFixed", () => {
			const result = toFixed(3.14, 21);
			expect(result[1]?.message).toBe(
				"Decimals must be an integer between 0 and 20"
			);
		});

		it("should parse valid number strings", () => {
			expect(parseNumber("123.45")[0]).toBe(123.45);
			expect(parseNumber("-123")[0]).toBe(-123);
			expect(parseNumber("0")[0]).toBe(0);
		});

		it("should handle invalid number strings", () => {
			const result = parseNumber("not a number");
			expect(result[1]?.message).toBe(
				"String cannot be converted to a valid number"
			);
		});

		it("should handle empty strings", () => {
			const result = parseNumber("");
			expect(result[1]?.message).toBe("String cannot be empty");
		});

		it("should handle non-string input", () => {
			const result = parseNumber(123 as any);
			expect(result[1]?.message).toBe("Input must be a string");
		});
	});

	describe("Edge cases and special values", () => {
		it("should allow NaN when configured", () => {
			const result = isInteger(NaN, { allowNaN: true });
			expect(result[0]).toBe(false);
			expect(result[1]).toBe(null);
		});

		it("should allow Infinity when configured", () => {
			const result = isInteger(Infinity, { allowInfinity: true });
			expect(result[0]).toBe(false);
			expect(result[1]).toBe(null);
		});

		it("should handle very large numbers", () => {
			const result = isInteger(Number.MAX_SAFE_INTEGER);
			expect(result[0]).toBe(true);
			expect(result[1]).toBe(null);
		});

		it("should handle very small numbers", () => {
			const result = isInteger(Number.MIN_SAFE_INTEGER);
			expect(result[0]).toBe(true);
			expect(result[1]).toBe(null);
		});
	});
});
