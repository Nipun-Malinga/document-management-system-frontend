// Fail immediately when test setup does not supply an expected object or callback.
export const requireValue = <T>(value: T | null | undefined): T => {
	if (value === null || value === undefined)
		throw new Error("Expected a defined test value.");
	return value;
};
