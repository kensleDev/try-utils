import { tryPromise } from "@julian-i/try-error";

export async function safeFetch<T>(
	url: string,
	options: RequestInit,
	returnJson = true
): Promise<T | Response> {
	const [data, fetchError] = await tryPromise(fetch(url, options));

	if (fetchError) {
		throw fetchError;
	}

	if (!data.ok) {
		return data;
	}

	if (returnJson) {
		const [json, jsonError] = await tryPromise(data.json());

		if (jsonError) {
			throw jsonError;
		}

		return json as T;
	}

	return data;
}
