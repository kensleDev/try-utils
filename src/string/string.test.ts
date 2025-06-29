import { describe, expect, it } from "vitest";
import {
	camelCase,
	capitalize,
	countWords,
	isPalindrome,
	kebabCase,
	pascalCase,
	removeExtraSpaces,
	reverse,
	snakeCase,
	titleCase,
	truncate,
} from "./index";

describe("String Utils - Error Handling", () => {
	describe("Common validation errors", () => {
		it("should handle null values", () => {
			const result = capitalize(null as any);
			expect(result[1]?.message).toBe("String is required");
		});

		it("should handle undefined values", () => {
			const result = capitalize(undefined as any);
			expect(result[1]?.message).toBe("String is required");
		});

		it("should handle non-string types", () => {
			const result = capitalize(123 as any);
			expect(result[1]?.message).toBe("Type must be a string");
		});

		it("should handle empty strings", () => {
			const result = capitalize("");
			expect(result[1]?.message).toBe("String must not be empty");
		});

		it("should handle whitespace-only strings by default", () => {
			const result = capitalize("   \t\n  ");
			expect(result[1]?.message).toBe("String must not be whitespace-only");
		});

		it("should allow whitespace-only strings when configured", () => {
			const result = capitalize("   \t\n  ", { allowWhitespaceOnly: true });
			expect(result[0]).toBe("   \t\n  ");
			expect(result[1]).toBe(null);
		});

		it("should handle strings exceeding max length", () => {
			const longString = "a".repeat(10001);
			const result = capitalize(longString);
			expect(result[1]?.message).toContain("exceeds maximum allowed length");
		});

		it("should allow custom max length", () => {
			const result = capitalize("hello", { maxLength: 3 });
			expect(result[1]?.message).toContain("exceeds maximum allowed length");
		});
	});

	describe("capitalize", () => {
		it("should capitalize single character", () => {
			const result = capitalize("a");
			expect(result[0]).toBe("A");
			expect(result[1]).toBe(null);
		});

		it("should capitalize first letter and lowercase rest", () => {
			const result = capitalize("HELLO");
			expect(result[0]).toBe("Hello");
			expect(result[1]).toBe(null);
		});
	});

	describe("camelCase", () => {
		it("should convert snake_case to camelCase", () => {
			const result = camelCase("hello_world");
			expect(result[0]).toBe("helloWorld");
			expect(result[1]).toBe(null);
		});

		it("should handle strings with only underscores", () => {
			const result = camelCase("___");
			expect(result[1]?.message).toBe("String contains only underscores");
		});

		it("should handle strings starting with underscores", () => {
			const result = camelCase("_hello_world");
			expect(result[0]).toBe("helloWorld");
			expect(result[1]).toBe(null);
		});
	});

	describe("snakeCase", () => {
		it("should convert camelCase to snake_case", () => {
			const result = snakeCase("helloWorld");
			expect(result[0]).toBe("hello_world");
			expect(result[1]).toBe(null);
		});

		it("should return already snake_case strings unchanged", () => {
			const result = snakeCase("hello_world");
			expect(result[0]).toBe("hello_world");
			expect(result[1]).toBe(null);
		});
	});

	describe("kebabCase", () => {
		it("should convert camelCase to kebab-case", () => {
			const result = kebabCase("helloWorld");
			expect(result[0]).toBe("hello-world");
			expect(result[1]).toBe(null);
		});

		it("should return already kebab-case strings unchanged", () => {
			const result = kebabCase("hello-world");
			expect(result[0]).toBe("hello-world");
			expect(result[1]).toBe(null);
		});
	});

	describe("pascalCase", () => {
		it("should convert snake_case to PascalCase", () => {
			const result = pascalCase("hello_world");
			expect(result[0]).toBe("HelloWorld");
			expect(result[1]).toBe(null);
		});

		it("should handle strings with only underscores", () => {
			const result = pascalCase("___");
			expect(result[1]?.message).toBe("String contains only underscores");
		});

		it("should handle strings starting with underscores", () => {
			const result = pascalCase("_hello_world");
			expect(result[0]).toBe("HelloWorld");
			expect(result[1]).toBe(null);
		});
	});

	describe("titleCase", () => {
		it("should capitalize first letter of each word", () => {
			const result = titleCase("hello world");
			expect(result[0]).toBe("Hello World");
			expect(result[1]).toBe(null);
		});

		it("should handle strings with only whitespace", () => {
			const result = titleCase("   \t\n  ");
			expect(result[1]?.message).toBe("String must not be whitespace-only");
		});
	});

	describe("truncate", () => {
		it("should truncate long strings", () => {
			const result = truncate("hello world", 5);
			expect(result[0]).toBe("he...");
			expect(result[1]).toBe(null);
		});

		it("should not truncate short strings", () => {
			const result = truncate("hi", 5);
			expect(result[0]).toBe("hi");
			expect(result[1]).toBe(null);
		});

		it("should handle invalid max length", () => {
			const result = truncate("hello", 0);
			expect(result[1]?.message).toBe("Max length must be greater than 0");
		});

		it("should handle max length shorter than suffix", () => {
			const result = truncate("hello", 2, "...");
			expect(result[1]?.message).toBe(
				"Max length must be greater than suffix length"
			);
		});
	});

	describe("reverse", () => {
		it("should reverse string", () => {
			const result = reverse("hello");
			expect(result[0]).toBe("olleh");
			expect(result[1]).toBe(null);
		});

		it("should handle empty string", () => {
			const result = reverse("");
			expect(result[1]?.message).toBe("String must not be empty");
		});
	});

	describe("countWords", () => {
		it("should count words correctly", () => {
			const result = countWords("hello world test");
			expect(result[0]).toBe(3);
			expect(result[1]).toBe(null);
		});

		it("should handle single word", () => {
			const result = countWords("hello");
			expect(result[0]).toBe(1);
			expect(result[1]).toBe(null);
		});

		it("should handle empty string", () => {
			const result = countWords("");
			expect(result[1]?.message).toBe("String must not be empty");
		});

		it("should handle whitespace-only string", () => {
			const result = countWords("   \t\n  ");
			expect(result[1]?.message).toBe("String must not be whitespace-only");
		});
	});

	describe("removeExtraSpaces", () => {
		it("should remove extra spaces", () => {
			const result = removeExtraSpaces("hello    world   test");
			expect(result[0]).toBe("hello world test");
			expect(result[1]).toBe(null);
		});

		it("should trim leading and trailing spaces", () => {
			const result = removeExtraSpaces("  hello world  ");
			expect(result[0]).toBe("hello world");
			expect(result[1]).toBe(null);
		});
	});

	describe("isPalindrome", () => {
		it("should detect palindromes", () => {
			const result = isPalindrome("racecar");
			expect(result[0]).toBe(true);
			expect(result[1]).toBe(null);
		});

		it("should handle case insensitive palindromes", () => {
			const result = isPalindrome("RaceCar");
			expect(result[0]).toBe(true);
			expect(result[1]).toBe(null);
		});

		it("should handle palindromes with punctuation", () => {
			const result = isPalindrome("A man, a plan, a canal: Panama");
			expect(result[0]).toBe(true);
			expect(result[1]).toBe(null);
		});

		it("should detect non-palindromes", () => {
			const result = isPalindrome("hello");
			expect(result[0]).toBe(false);
			expect(result[1]).toBe(null);
		});

		it("should handle strings with no alphanumeric characters", () => {
			const result = isPalindrome("!@#$%");
			expect(result[1]?.message).toBe(
				"String contains no alphanumeric characters"
			);
		});
	});

	describe("Control character validation", () => {
		it("should reject strings with control characters when configured", () => {
			const result = capitalize("hello\x00world", { allowSpecialChars: false });
			expect(result[1]?.message).toBe(
				"String contains invalid control characters"
			);
		});

		it("should allow strings with control characters by default", () => {
			const result = capitalize("hello\x00world");
			expect(result[0]).toBe("Hello\x00world");
			expect(result[1]).toBe(null);
		});
	});
});
