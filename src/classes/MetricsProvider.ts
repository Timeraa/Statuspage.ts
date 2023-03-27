import { Result } from "true-myth";

import {
	AuthenticationError,
	BadRequestError,
	ForbiddenError,
	formatError,
	NotFoundError,
	UnprocessableEntityError,
} from "./Errors.js";
import StatuspageApi from "./StatuspageApi.js";

export interface MetricProvider {
	id: string;
	type: string;
	disabled: boolean;
	metric_base_uric: string;
	last_revalidated_at: string;
	created_at: string;
	updated_at: string;
	page_id: number;
}

export default class MetricsProvider {
	constructor(public statusPage: StatuspageApi) {}

	async getAll(
		pageId: string
	): Promise<
		Result<
			MetricProvider[],
			AuthenticationError | ForbiddenError | NotFoundError
		>
	> {
		const result = await this.statusPage.ky.get(
			`pages/${pageId}/metrics_providers`
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async create(
		pageId: string,
		metricsProvider: Partial<{
			email: string;
			password: string;
			api_key: string;
			api_token: string;
			application_key: string;
			type: string;
			metric_base_uri: string;
		}>
	): Promise<
		Result<
			MetricProvider,
			| BadRequestError
			| AuthenticationError
			| ForbiddenError
			| NotFoundError
			| UnprocessableEntityError
		>
	> {
		const result = await this.statusPage.ky.post(
			`pages/${pageId}/metrics_providers`,
			{
				json: { metrics_provider: metricsProvider },
			}
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async get(
		pageId: string,
		metricsProviderId: string
	): Promise<
		Result<MetricProvider, AuthenticationError | ForbiddenError | NotFoundError>
	> {
		const result = await this.statusPage.ky.get(
			`pages/${pageId}/metrics_providers/${metricsProviderId}`
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async update(
		pageId: string,
		metricsProviderId: string,
		metricsProvider: Partial<{ type: string; metric_base_uri: string }>,
		replace: boolean
	) {
		const result = await this.statusPage.ky[replace ? "put" : "patch"](
			`pages/${pageId}/metrics_providers/${metricsProviderId}`,
			{
				json: { metrics_provider: metricsProvider },
			}
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}
}
