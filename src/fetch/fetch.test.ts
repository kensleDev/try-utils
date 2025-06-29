import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { safeFetch } from "./index";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Helper function to create mock Response objects
function createMockResponse(data: any, status = 200, ok = true) {
	const mockJson = vi.fn().mockResolvedValue(data);
	return {
		ok,
		status,
		statusText: ok ? "OK" : "Error",
		headers: new Headers(),
		redirected: false,
		type: "default" as ResponseType,
		url: "https://api.example.com/data",
		json: mockJson,
		text: vi.fn().mockResolvedValue(JSON.stringify(data)),
		blob: vi.fn(),
		arrayBuffer: vi.fn(),
		formData: vi.fn(),
		clone: vi.fn(),
		body: null,
		bodyUsed: false,
	} as unknown as Response;
}

describe("safeFetch", () => {
	beforeEach(() => {
		mockFetch.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("Successful requests", () => {
		it("should return JSON data when returnJson is true (default)", async () => {
			const mockResponse = createMockResponse({ data: "test" });
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch<{ data: string }>(
				"https://api.example.com/data",
				{}
			);

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				{}
			);
			expect(mockResponse.json).toHaveBeenCalled();
			expect(result).toEqual({ data: "test" });
		});

		it("should return Response object when returnJson is false", async () => {
			const mockResponse = createMockResponse({ data: "test" });
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch("https://api.example.com/data", {}, false);

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				{}
			);
			expect(mockResponse.json).not.toHaveBeenCalled();
			expect(result).toBe(mockResponse);
		});

		it("should handle different HTTP methods", async () => {
			const mockResponse = createMockResponse({ id: 123 }, 201);
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch<{ id: number }>(
				"https://api.example.com/users",
				{ method: "POST", body: JSON.stringify({ name: "John" }) }
			);

			expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", {
				method: "POST",
				body: JSON.stringify({ name: "John" }),
			});
			expect(result).toEqual({ id: 123 });
		});

		it("should handle headers", async () => {
			const mockResponse = createMockResponse({ message: "success" });
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch<{ message: string }>(
				"https://api.example.com/data",
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer token123",
					},
				}
			);

			expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/data", {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer token123",
				},
			});
			expect(result).toEqual({ message: "success" });
		});
	});

	describe("Network errors", () => {
		it("should throw error when fetch fails", async () => {
			const networkError = new Error("Network error");
			mockFetch.mockRejectedValue(networkError);

			await expect(
				safeFetch("https://api.example.com/data", {})
			).rejects.toThrow("Network error");

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				{}
			);
		});

		it("should return Response object when fetch returns non-ok response", async () => {
			const mockResponse = createMockResponse(null, 404, false);
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch("https://api.example.com/data", {});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				{}
			);
			expect(result).toBe(mockResponse);
			expect((result as Response).status).toBe(404);
		});

		it("should return Response object when fetch returns 500 error", async () => {
			const mockResponse = createMockResponse(null, 500, false);
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch("https://api.example.com/data", {});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				{}
			);
			expect(result).toBe(mockResponse);
			expect((result as Response).status).toBe(500);
		});
	});

	describe("JSON parsing errors", () => {
		it("should throw error when JSON parsing fails", async () => {
			const mockResponse = createMockResponse({ data: "test" });
			(mockResponse.json as any).mockRejectedValue(new Error("Invalid JSON"));
			mockFetch.mockResolvedValue(mockResponse);

			await expect(
				safeFetch("https://api.example.com/data", {})
			).rejects.toThrow("Invalid JSON");

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				{}
			);
			expect(mockResponse.json).toHaveBeenCalled();
		});

		it("should not attempt JSON parsing when returnJson is false", async () => {
			const mockResponse = createMockResponse({ data: "test" });
			// Don't mock rejection here since we're not calling json()
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch("https://api.example.com/data", {}, false);

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				{}
			);
			expect(mockResponse.json).not.toHaveBeenCalled();
			expect(result).toBe(mockResponse);
		});
	});

	describe("Edge cases", () => {
		it("should handle empty response body", async () => {
			const mockResponse = createMockResponse(null, 204);
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch("https://api.example.com/data", {});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				{}
			);
			expect(result).toBeNull();
		});

		it("should handle large JSON responses", async () => {
			const largeData = {
				items: Array.from({ length: 1000 }, (_, i) => ({
					id: i,
					name: `Item ${i}`,
				})),
			};
			const mockResponse = createMockResponse(largeData);
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch<typeof largeData>(
				"https://api.example.com/data",
				{}
			);

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				{}
			);
			expect(result).toEqual(largeData);
			// Type assertion since we know it's the JSON data when returnJson is true
			expect((result as typeof largeData).items).toHaveLength(1000);
		});

		it("should handle different data types in JSON response", async () => {
			const complexData = {
				string: "test",
				number: 123,
				boolean: true,
				null: null,
				array: [1, 2, 3],
				object: { nested: "value" },
			};
			const mockResponse = createMockResponse(complexData);
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch<typeof complexData>(
				"https://api.example.com/data",
				{}
			);

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				{}
			);
			expect(result).toEqual(complexData);
		});

		it("should handle URL with query parameters", async () => {
			const mockResponse = createMockResponse({ data: "test" });
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch<{ data: string }>(
				"https://api.example.com/data?page=1&limit=10&search=test",
				{}
			);

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data?page=1&limit=10&search=test",
				{}
			);
			expect(result).toEqual({ data: "test" });
		});

		it("should handle URL with special characters", async () => {
			const mockResponse = createMockResponse({ data: "test" });
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch<{ data: string }>(
				"https://api.example.com/data/user%20name/123",
				{}
			);

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data/user%20name/123",
				{}
			);
			expect(result).toEqual({ data: "test" });
		});
	});

	describe("Request options", () => {
		it("should handle different request methods", async () => {
			const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
			const mockResponse = createMockResponse({ success: true });

			for (const method of methods) {
				mockFetch.mockResolvedValue(mockResponse);

				await safeFetch("https://api.example.com/data", { method });

				expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/data", {
					method,
				});
			}
		});

		it("should handle request body", async () => {
			const mockResponse = createMockResponse({ success: true });
			mockFetch.mockResolvedValue(mockResponse);

			const body = JSON.stringify({ name: "John", age: 30 });

			await safeFetch("https://api.example.com/users", {
				method: "POST",
				body,
				headers: { "Content-Type": "application/json" },
			});

			expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", {
				method: "POST",
				body,
				headers: { "Content-Type": "application/json" },
			});
		});

		it("should handle FormData body", async () => {
			const mockResponse = createMockResponse({ success: true });
			mockFetch.mockResolvedValue(mockResponse);

			const formData = new FormData();
			formData.append("name", "John");
			formData.append("file", new Blob(["test"]));

			await safeFetch("https://api.example.com/upload", {
				method: "POST",
				body: formData,
			});

			expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/upload", {
				method: "POST",
				body: formData,
			});
		});

		it("should handle request with credentials", async () => {
			const mockResponse = createMockResponse({ success: true });
			mockFetch.mockResolvedValue(mockResponse);

			await safeFetch("https://api.example.com/data", {
				credentials: "include",
			});

			expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/data", {
				credentials: "include",
			});
		});

		it("should handle request with mode", async () => {
			const mockResponse = createMockResponse({ success: true });
			mockFetch.mockResolvedValue(mockResponse);

			await safeFetch("https://api.example.com/data", {
				mode: "cors",
			});

			expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/data", {
				mode: "cors",
			});
		});
	});

	describe("Error handling scenarios", () => {
		it("should handle timeout errors", async () => {
			const timeoutError = new Error("Request timeout");
			mockFetch.mockRejectedValue(timeoutError);

			await expect(
				safeFetch("https://api.example.com/data", {})
			).rejects.toThrow("Request timeout");
		});

		it("should handle DNS resolution errors", async () => {
			const dnsError = new Error("Failed to fetch");
			mockFetch.mockRejectedValue(dnsError);

			await expect(
				safeFetch("https://nonexistent-domain.com/data", {})
			).rejects.toThrow("Failed to fetch");
		});

		it("should handle CORS errors", async () => {
			const corsError = new Error("CORS policy violation");
			mockFetch.mockRejectedValue(corsError);

			await expect(
				safeFetch("https://api.example.com/data", {})
			).rejects.toThrow("CORS policy violation");
		});

		it("should handle malformed JSON response", async () => {
			const mockResponse = createMockResponse({ data: "test" });
			(mockResponse.json as any).mockRejectedValue(
				new SyntaxError("Unexpected token < in JSON at position 0")
			);
			mockFetch.mockResolvedValue(mockResponse);

			await expect(
				safeFetch("https://api.example.com/data", {})
			).rejects.toThrow("Unexpected token < in JSON at position 0");
		});
	});

	describe("Type safety", () => {
		it("should maintain type safety with generic types", async () => {
			interface User {
				id: number;
				name: string;
				email: string;
			}

			const mockUser: User = {
				id: 1,
				name: "John Doe",
				email: "john@example.com",
			};

			const mockResponse = createMockResponse(mockUser);
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch<User>(
				"https://api.example.com/users/1",
				{}
			);

			expect(result).toEqual(mockUser);
			// Type assertion since we know it's the User when returnJson is true
			const user = result as User;
			expect(typeof user.id).toBe("number");
			expect(typeof user.name).toBe("string");
			expect(typeof user.email).toBe("string");
		});

		it("should handle array responses", async () => {
			const mockUsers = [
				{ id: 1, name: "John" },
				{ id: 2, name: "Jane" },
			];

			const mockResponse = createMockResponse(mockUsers);
			mockFetch.mockResolvedValue(mockResponse);

			const result = await safeFetch<typeof mockUsers>(
				"https://api.example.com/users",
				{}
			);

			expect(result).toEqual(mockUsers);
			// Type assertion since we know it's the array when returnJson is true
			expect(Array.isArray(result as typeof mockUsers)).toBe(true);
			expect(result as typeof mockUsers).toHaveLength(2);
		});
	});
});
