import { Result } from "true-myth";

import { AuthenticationError, formatError, NotFoundError } from "./Errors.js";
import StatuspageApi from "./StatuspageApi.js";

export interface IncidentUpdate {
	id: string;
	incident_id: string;
	affected_components:
		| null
		| {
				code: string;
				name: string;
				old_status: string;
				new_status: string;
		  }[];
	body: string;
	created_at: string;
	custom_tweet: null | string;
	deliver_notifications: boolean;
	display_at: string;
	status: string;
	tweet_id: null | string;
	twitter_updated_at: null | string;
	updated_at: string;
	wants_twitter_update: boolean;
}

export default class IncidentUpdates {
	constructor(public statusPage: StatuspageApi) {}

	async create(
		pageId: string,
		incidentId: string,
		incidentUpdateId: string,
		incidentUpdate: Partial<{
			wants_twitter_update: boolean;
			body: string;
			display_at: string;
			deliver_notifications: boolean;
		}>,
		replace?: boolean
	): Promise<Result<IncidentUpdate, AuthenticationError | NotFoundError>> {
		const result = await this.statusPage.ky[replace ? "put" : "patch"](
			`pages/${pageId}/incidents/${incidentId}/incident_updates/${incidentUpdateId}`,
			{
				json: { incident_update: incidentUpdate },
			}
		);

		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}
}
