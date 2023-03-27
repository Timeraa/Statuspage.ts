import { Result } from "true-myth";

import {
	AuthenticationError,
	ForbiddenError,
	formatError,
	MethodNotAllowedError,
	NotFoundError,
	UnprocessableEntityError,
} from "./Errors.js";
import StatuspageApi from "./StatuspageApi.js";

export interface MetricPoint {
	/**
	 * Unix timestamp in seconds
	 */
	timestamp: number;
	/**
	 * Value of the metric
	 */
	value: number;
}

export interface Metric {
	id: string;
	metrics_provider_id: string;
	metric_identifier: string;
	name: string;
	display: true;
	tooltip_description: string;
	backfilled: true;
	y_axis_min: number;
	y_axis_max: number;
	y_axis_hidden: true;
	suffix: string;
	decimal_places: number;
	most_recent_data_at: string;
	created_at: string;
	updated_at: string;
	last_fetched_at: string;
	backfill_percentage: number;
	reference_name: string;
}

export default class Metrics {
	constructor(public statusPage: StatuspageApi) {}

	async addDataPoints(
		pageId: string,
		data: Record<string, MetricPoint[]>
	): Promise<
		Result<
			Record<string, MetricPoint[]>,
			| AuthenticationError
			| ForbiddenError
			| NotFoundError
			| MethodNotAllowedError
		>
	> {
		const result = await this.statusPage.ky.post(
			`pages/${pageId}/metrics/data`,
			{
				json: { data },
			}
		);

		if (!result.ok) Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async getAll(
		pageId: string,
		options?: { page?: number; per_page?: string }
	): Promise<Result<Metric[], AuthenticationError | NotFoundError>> {
		const searchParameters = new URLSearchParams();

		if (options?.page) searchParameters.set("page", options.page.toString());
		if (options?.per_page)
			searchParameters.set("per_page", options.per_page.toString());

		const result = await this.statusPage.ky.get(`pages/${pageId}/metrics`, {
			searchParams: searchParameters,
		});

		if (!result.ok) Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async update(
		pageId: string,
		metricId: string,
		metric: Partial<{ name: string; metric_identifier: string }>,
		replace?: boolean
	): Promise<
		Result<
			Metric,
			AuthenticationError | NotFoundError | UnprocessableEntityError
		>
	> {
		const result = await this.statusPage.ky[replace ? "put" : "patch"](
			`pages/${pageId}/metrics/${metricId}`,
			{
				json: { metric },
			}
		);

		if (!result.ok) Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async delete(
		pageId: string,
		metricId: string
	): Promise<Result<Metric, AuthenticationError | NotFoundError>> {
		const result = await this.statusPage.ky.delete(
			`pages/${pageId}/metrics/${metricId}`
		);

		if (!result.ok) Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async get(
		pageId: string,
		metricId: string
	): Promise<Result<Metric, AuthenticationError | NotFoundError>> {
		const result = await this.statusPage.ky.get(
			`pages/${pageId}/metrics/${metricId}`
		);

		if (!result.ok) Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async reset(
		pageId: string,
		metricId: string
	): Promise<Result<Metric, AuthenticationError | NotFoundError>> {
		const result = await this.statusPage.ky.delete(
			`pages/${pageId}/metrics/${metricId}/data`
		);

		if (!result.ok) Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	//* Add data to a metric skipped because it's repetitive for .addDataPoints()

	async listProviderMetrics(
		pageId: string,
		metricProviderId: string
	): Promise<
		Result<Metric[], AuthenticationError | NotFoundError | ForbiddenError>
	> {
		const result = await this.statusPage.ky.get(
			`pages/${pageId}/metrics_providers/${metricProviderId}/metrics`
		);

		if (!result.ok) Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async addProviderMetric(
		pageId: string,
		metricProviderId: string,
		metric: {
			name: string;
			metric_identifier: string;
			transform: string;
			suffix: string;
			y_axis_min: number;
			y_axis_max: number;
			y_axis_hidden: boolean;
			display: boolean;
			decimal_places: number;
			tooltip_description: string;
		}
	): Promise<
		Result<
			Metric,
			| AuthenticationError
			| NotFoundError
			| ForbiddenError
			| UnprocessableEntityError
		>
	> {
		const result = await this.statusPage.ky.post(
			`pages/${pageId}/metrics_providers/${metricProviderId}/metrics`,
			{
				json: { metric },
			}
		);

		if (!result.ok) Result.err(await formatError(result));

		return Result.ok(await result.json());
	}
}
