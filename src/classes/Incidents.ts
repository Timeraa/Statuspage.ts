import { Result } from "true-myth";

import {
	AuthenticationError,
	BadRequestError,
	formatError,
	NotFoundError,
	UnprocessableEntityError,
} from "./Errors.js";
import { IncidentUpdate } from "./IncidentUpdates.js";
import StatuspageApi from "./StatuspageApi.js";

export interface IncidentCreationData {
	name: string;
	status?: string;
	impact_override?: string;
	scheduled_for?: string;
	scheduled_until?: string;
	scheduled_remind_prior?: boolean;
	auto_transition_to_maintenance_state?: boolean;
	auto_transition_to_operational_state?: boolean;
	scheduled_auto_in_progress?: boolean;
	scheduled_auto_completed?: boolean;
	auto_transition_deliver_notifications_at_start?: boolean;
	auto_transition_deliver_notifications_at_end?: boolean;
	metadata?: Record<string, unknown>;
	deliver_notifications?: boolean;
	auto_tweet_at_beginning?: boolean;
	auto_tweet_on_completion?: boolean;
	auto_tweet_on_creation?: boolean;
	auto_tweet_one_hour_before?: boolean;
	backfill_date?: string;
	backfilled?: boolean;
	body?: string;
	components?: Record<string, string>;
	component_ids?: string[];
	scheduled_auto_transition?: boolean;
}

export interface Incident {
	id: string;
	components: {
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
	}[];
	created_at: string;
	impact: string;
	impact_override: string | null;
	incident_updates: IncidentUpdate[];
	metadata: {
		jira?: {
			issue_id: string;
		};
	};
	monitoring_at: null | string;
	name: string;
	page_id: string;
	postmortem_body: null | string;
	postmortem_body_last_updated_at: null | string;
	postmortem_ignored: boolean;
	postmortem_notified_subscribers: boolean;
	postmortem_notified_twitter: boolean;
	postmortem_published_at: null | string;
	resolved_at: null | string;
	scheduled_auto_completed: boolean;
	scheduled_auto_in_progress: boolean;
	scheduled_for: null | string;
	auto_transition_deliver_notifications_at_end: null | boolean;
	auto_transition_deliver_notifications_at_start: null | boolean;
	auto_transition_to_maintenance_state: null | boolean;
	auto_transition_to_operational_state: null | boolean;
	scheduled_remind_prior: boolean;
	scheduled_reminded_at: null;
	scheduled_until: null;
	shortlink: string;
	status: string;
	updated_at: string;
}

export default class Incidents {
	constructor(public statusPage: StatuspageApi) {}

	async create(
		pageId: string,
		incident: IncidentCreationData
	): Promise<
		Result<
			Incident,
			| BadRequestError
			| AuthenticationError
			| NotFoundError
			| UnprocessableEntityError
		>
	> {
		const result = await this.statusPage.ky.post(`pages/${pageId}/incidents`, {
			json: { incident },
		});

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async getAll(
		pageId: string,
		options?: { q?: string; limit?: number; page?: number }
	): Promise<
		Result<Incident[], BadRequestError | AuthenticationError | NotFoundError>
	> {
		const searchParameters = new URLSearchParams();

		if (options?.q) searchParameters.set("q", options.q);
		if (options?.limit) searchParameters.set("limit", options.limit.toString());
		if (options?.page) searchParameters.set("page", options.page.toString());

		const result = await this.statusPage.ky.get(`pages/${pageId}/incidents`, {
			searchParams: searchParameters,
		});

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async getActiveMaintenances(
		pageId: string,
		options?: { per_page?: number; page?: number }
	): Promise<Result<Incident[], AuthenticationError | NotFoundError>> {
		const searchParameters = new URLSearchParams();

		if (options?.per_page)
			searchParameters.set("per_page", options.per_page.toString());
		if (options?.page) searchParameters.set("page", options.page.toString());

		const result = await this.statusPage.ky.get(
			`pages/${pageId}/incidents/active_maintenance`,
			{
				searchParams: searchParameters,
			}
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async getUpcoming(
		pageId: string,
		options?: { per_page?: number; page?: number }
	): Promise<Result<Incident[], AuthenticationError | NotFoundError>> {
		const searchParameters = new URLSearchParams();

		if (options?.per_page)
			searchParameters.set("per_page", options.per_page.toString());
		if (options?.page) searchParameters.set("page", options.page.toString());

		const result = await this.statusPage.ky.get(
			`pages/${pageId}/incidents/upcoming`,
			{
				searchParams: searchParameters,
			}
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async getScheduled(
		pageId: string,
		options?: { per_page?: number; page?: number }
	): Promise<Result<Incident[], AuthenticationError | NotFoundError>> {
		const searchParameters = new URLSearchParams();

		if (options?.per_page)
			searchParameters.set("per_page", options.per_page.toString());
		if (options?.page) searchParameters.set("page", options.page.toString());

		const result = await this.statusPage.ky.get(
			`pages/${pageId}/incidents/scheduled`,
			{
				searchParams: searchParameters,
			}
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async getUnresolved(
		pageId: string,
		options?: { per_page?: number; page?: number }
	): Promise<Result<Incident[], AuthenticationError | NotFoundError>> {
		const searchParameters = new URLSearchParams();

		if (options?.per_page)
			searchParameters.set("per_page", options.per_page.toString());
		if (options?.page) searchParameters.set("page", options.page.toString());

		const result = await this.statusPage.ky.get(
			`pages/${pageId}/incidents/unresolved`,
			{
				searchParams: searchParameters,
			}
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async delete(
		pageId: string,
		incidentId: string
	): Promise<Result<Incident, AuthenticationError | NotFoundError>> {
		const result = await this.statusPage.ky.delete(
			`pages/${pageId}/incidents/${incidentId}`
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async update(
		pageId: string,
		incidentId: string,
		incident: Partial<IncidentCreationData>,
		replace = false
	): Promise<Result<Incident, AuthenticationError | NotFoundError>> {
		const result = await this.statusPage.ky[replace ? "put" : "patch"](
			`pages/${pageId}/incidents/${incidentId}`,
			{
				json: { incident },
			}
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	async get(
		pageId: string,
		incidentId: string
	): Promise<Result<Incident, AuthenticationError | NotFoundError>> {
		const result = await this.statusPage.ky.get(
			`pages/${pageId}/incidents/${incidentId}`
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}
}
