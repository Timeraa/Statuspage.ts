import { Result } from "true-myth";

import {
	AuthenticationError,
	formatError,
	NotFoundError,
	UnprocessableEntityError,
} from "./Errors.js";
import StatuspageApi from "./StatuspageApi.js";

export interface ComponentCreateData {
	description?: string;
	status?: string;
	name: string;
	only_show_if_degraded?: boolean;
	group_id?: string;
	showcase?: boolean;
	start_date?: string;
}

export interface Component {
	id: string;
	page_id: string;
	group_id: string;
	created_at: string;
	updated_at: string;
	group: boolean;
	name: string;
	description: string;
	position: number;
	status: string;
	showcase: boolean;
	only_show_if_degraded: boolean;
	automation_email: string;
	start_date: string;
}

export default class Components {
	constructor(public statusPage: StatuspageApi) {}

	async update(
		pageId: string,
		componentId: string,
		component: Partial<
			Pick<
				ComponentCreateData,
				| "description"
				| "name"
				| "status"
				| "only_show_if_degraded"
				| "group_id"
				| "showcase"
				| "start_date"
			>
		>,
		replace = false
	): Promise<Result<Component, AuthenticationError | NotFoundError>> {
		const result = await this.statusPage.ky[replace ? "put" : "patch"](
			`pages/${pageId}/components/${componentId}`,
			{
				json: { component },
			}
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async getAll(
		pageId: string,
		options?: { page?: number; per_page?: number }
	): Promise<Result<Component[], AuthenticationError>> {
		const searchParameters = new URLSearchParams();

		if (options?.per_page)
			searchParameters.set("per_page", options.per_page.toString());
		if (options?.page) searchParameters.set("page", options.page.toString());

		const result = await this.statusPage.ky.get(`pages/${pageId}/components`, {
			searchParams: searchParameters,
		});

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async get(
		pageId: string,
		componentId: string
	): Promise<Result<Component, AuthenticationError | NotFoundError>> {
		const result = await this.statusPage.ky.get(
			`pages/${pageId}/components/${componentId}`
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async getUptime(
		pageId: string,
		componentId: string
	): Promise<
		Result<
			{
				range_start: string;
				range_end: string;
				uptime_percentage: number;
				major_outage: number;
				partial_outage: number;
				warnings: string[];
				id: string;
				name: string;
				related_events: {
					id: string;
				}[];
			},
			AuthenticationError | NotFoundError | UnprocessableEntityError
		>
	> {
		const result = await this.statusPage.ky.get(
			`pages/${pageId}/components/${componentId}/uptime`
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async create(
		pageId: string,
		component: ComponentCreateData
	): Promise<
		Result<Components, AuthenticationError | UnprocessableEntityError>
	> {
		const result = await this.statusPage.ky.post(`pages/${pageId}/components`, {
			json: { component },
		});

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async delete(
		pageId: string,
		componentId: string
	): Promise<Result<true, AuthenticationError | NotFoundError>> {
		const result = await this.statusPage.ky.delete(
			`pages/${pageId}/components/${componentId}`
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(true);
	}
}
