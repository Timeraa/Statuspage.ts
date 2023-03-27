export class AuthenticationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AuthenticationError";
	}
}

export class BadRequestError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "BadRequestError";
	}
}

export class ForbiddenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ForbiddenError";
	}
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
	}
}

export class UnprocessableEntityError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnprocessableEntityError";
	}
}

export class RateLimitError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RateLimitError";
	}
}

export class ConflictError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ConflictError";
	}
}

export class MethodNotAllowedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MethodNotAllowedError";
	}
}

export async function formatError(error: unknown) {
	const errorNew = error as Response,
		{ error: message } = (await errorNew.json()) as { error: string };

	switch (errorNew.status) {
		case 400:
			return new BadRequestError(message);
		case 401:
			return new AuthenticationError(message);
		case 403:
			return new ForbiddenError(message);
		case 404:
			return new NotFoundError(message);
		case 422:
			return new UnprocessableEntityError(message);
		case 420:
		case 429:
			return new RateLimitError(message);
	}

	return new AuthenticationError(message);
}
