import { tryCatch } from "@julian-i/try-error";

interface StringValidationOptions {
	maxLength?: number;
	allowWhitespaceOnly?: boolean;
	allowSpecialChars?: boolean;
}

const DEFAULT_OPTIONS: StringValidationOptions = {
	maxLength: 10000, // 10KB limit to prevent performance issues
	allowWhitespaceOnly: false,
	allowSpecialChars: true,
};

const isString = (
	str: string,
	options: StringValidationOptions = DEFAULT_OPTIONS
) => {
	const opts = { ...DEFAULT_OPTIONS, ...options };

	// Check for null/undefined
	if (str == null) throw new Error("String is required");

	// Check for non-string types
	if (typeof str !== "string") throw new Error("Type must be a string");

	// Check for empty strings
	if (str.length === 0) throw new Error("String must not be empty");

	// Check for whitespace-only strings
	if (!opts.allowWhitespaceOnly && str.trim().length === 0) {
		throw new Error("String must not be whitespace-only");
	}

	// Check for maximum length
	if (opts.maxLength && str.length > opts.maxLength) {
		throw new Error(
			`String length (${str.length}) exceeds maximum allowed length (${opts.maxLength})`
		);
	}

	// Check for problematic Unicode characters (optional)
	if (!opts.allowSpecialChars) {
		// Check for control characters except common whitespace
		const hasControlChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(str);
		if (hasControlChars) {
			throw new Error("String contains invalid control characters");
		}
	}
};

export const capitalize = (str: string, options?: StringValidationOptions) =>
	tryCatch(() => {
		isString(str, options);
		if (str.length === 1) return str.toUpperCase();
		const firstLetter = str.charAt(0).toUpperCase();
		const restOfString = str.slice(1).toLowerCase();
		return firstLetter + restOfString;
	});

export const camelCase = (str: string, options?: StringValidationOptions) =>
	tryCatch(() => {
		isString(str, options);
		// Handle edge case where string starts with underscore
		const trimmed = str.replace(/^_+/, "");
		if (trimmed.length === 0)
			throw new Error("String contains only underscores");

		const result = trimmed
			.replace(/_/g, " ")
			.replace(/\b\w/g, (char) => char.toUpperCase())
			.replace(/\s+/g, "");

		// Ensure first letter is lowercase for camelCase
		return result.charAt(0).toLowerCase() + result.slice(1);
	});

export const snakeCase = (str: string, options?: StringValidationOptions) =>
	tryCatch(() => {
		isString(str, options);
		// Handle edge case where string is already in snake_case
		if (/^[a-z_]+$/.test(str)) return str;

		return str.replace(/([A-Z])/g, "_$1").toLowerCase();
	});

export const kebabCase = (str: string, options?: StringValidationOptions) =>
	tryCatch(() => {
		isString(str, options);
		// Handle edge case where string is already in kebab-case
		if (/^[a-z-]+$/.test(str)) return str;

		return str.replace(/([A-Z])/g, "-$1").toLowerCase();
	});

export const pascalCase = (str: string, options?: StringValidationOptions) =>
	tryCatch(() => {
		isString(str, options);
		// Handle edge case where string starts with underscore
		const trimmed = str.replace(/^_+/, "");
		if (trimmed.length === 0)
			throw new Error("String contains only underscores");

		return trimmed.replace(/(^|_)([a-z])/g, (_, __, char) =>
			char.toUpperCase()
		);
	});

export const titleCase = (str: string, options?: StringValidationOptions) =>
	tryCatch(() => {
		isString(str, options);
		// Handle edge case where string contains only whitespace
		const trimmed = str.trim();
		if (trimmed.length === 0)
			throw new Error("String contains only whitespace");

		return str.replace(/\b\w/g, (char) => char.toUpperCase());
	});

// Additional utility functions with comprehensive error handling

export const truncate = (
	str: string,
	maxLength: number,
	suffix: string = "...",
	options?: StringValidationOptions
) =>
	tryCatch(() => {
		isString(str, options);
		if (maxLength <= 0) throw new Error("Max length must be greater than 0");
		if (maxLength <= suffix.length)
			throw new Error("Max length must be greater than suffix length");

		if (str.length <= maxLength) return str;
		return str.slice(0, maxLength - suffix.length) + suffix;
	});

export const reverse = (str: string, options?: StringValidationOptions) =>
	tryCatch(() => {
		isString(str, options);
		return str.split("").reverse().join("");
	});

export const countWords = (str: string, options?: StringValidationOptions) =>
	tryCatch(() => {
		isString(str, options);
		const trimmed = str.trim();
		if (trimmed.length === 0) return 0;
		return trimmed.split(/\s+/).length;
	});

export const removeExtraSpaces = (
	str: string,
	options?: StringValidationOptions
) =>
	tryCatch(() => {
		isString(str, options);
		return str.replace(/\s+/g, " ").trim();
	});

export const isPalindrome = (str: string, options?: StringValidationOptions) =>
	tryCatch(() => {
		isString(str, options);
		const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
		if (cleaned.length === 0)
			throw new Error("String contains no alphanumeric characters");
		return cleaned === cleaned.split("").reverse().join("");
	});
