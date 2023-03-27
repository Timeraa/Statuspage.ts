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

export interface Image {
	updated_at: string;
	size: number | null;
	url: string;
}

export type FullImage = Image & {
	original_url: string;
	normal_url: string;
	retina_url: string;
};

/**
 * Your page profile drives basic settings for your status page including your company name, notification preferences, and time zone.
 */
export interface Page {
	/**
	 * Page identifier
	 */
	id: string;
	/**
	 * Timestamp the record was created
	 */
	created_at: string;
	/**
	 * Timestamp the record was last updated
	 */
	updated_at: string | null;
	/**
	 * Name of your page to be displayed
	 */
	name: string;
	page_description: string | null;
	headline: string;
	/**
	 * The main template your statuspage will use
	 */
	branding: string;
	/**
	 * Subdomain at which to access your status page
	 */
	subdomain: string;
	/**
	 * CNAME alias for your status page
	 */
	domain: string;
	/**
	 * Website of your page. Clicking on your statuspage image will link here
	 */
	url: string;
	support_url: string;
	/**
	 * Should your page hide itself from search engines
	 */
	hidden_from_search: boolean;
	/**
	 * Can your users subscribe to all notifications on the page
	 */
	allow_page_subscribers: boolean;
	/**
	 * Can your users subscribe to notifications for a single incident
	 */
	allow_incident_subscribers: boolean;
	/**
	 * Can your users choose to receive notifications via email
	 */
	allow_email_subscribers: boolean;
	/**
	 * Can your users choose to receive notifications via SMS
	 */
	allow_sms_subscribers: boolean;
	/**
	 * Can your users choose to access incident feeds via RSS/Atom (not functional on Audience-Specific pages)
	 */
	allow_rss_atom_feeds: boolean;
	/**
	 * Can your users choose to receive notifications via Webhooks
	 */
	allow_webhook_subscribers: boolean;
	/**
	 * Allows you to customize the email address your page notifications come from
	 */
	notifications_from_email: string | null;
	/**
	 * Allows you to customize the footer appearing on your notification emails. Accepts Markdown for formatting
	 */
	notifications_email_footer: string;
	activity_score: number;
	twitter_username: string;
	viewers_must_be_team_members: boolean;
	ip_restrictions: string | null;
	city: string | null;
	state: string | null;
	country: string | null;
	/**
	 * Timezone configured for your page
	 */
	time_zone: string;
	/**
	 * CSS Color
	 */
	css_body_background_color: string;
	/**
	 * CSS Color
	 */
	css_font_color: string;
	/**
	 * CSS Color
	 */
	css_light_font_color: string;
	/**
	 * CSS Color
	 */
	css_greens: string;
	/**
	 * CSS Color
	 */
	css_yellows: string;
	/**
	 * CSS Color
	 */
	css_oranges: string;
	/**
	 * CSS Color
	 */
	css_blues: string;
	/**
	 * CSS Color
	 */
	css_reds: string;
	/**
	 * CSS Color
	 */
	css_border_color: string;
	/**
	 * CSS Color
	 */
	css_graph_color: string;
	/**
	 * CSS Color
	 */
	css_link_color: string;
	/**
	 * CSS Color
	 */
	css_no_data: string;
	favicon_logo: Image;
	transactional_logo: FullImage;
	hero_cover: FullImage;
	email_logo: FullImage;
	twitter_logo: Image;
}

export type PageUpdateData = Pick<
	Page,
	| "name"
	| "domain"
	| "subdomain"
	| "url"
	| "branding"
	| "css_body_background_color"
	| "css_font_color"
	| "css_light_font_color"
	| "css_greens"
	| "css_yellows"
	| "css_oranges"
	| "css_reds"
	| "css_blues"
	| "css_border_color"
	| "css_graph_color"
	| "css_link_color"
	| "css_no_data"
	| "hidden_from_search"
	| "viewers_must_be_team_members"
	| "allow_page_subscribers"
	| "allow_incident_subscribers"
	| "allow_email_subscribers"
	| "allow_sms_subscribers"
	| "allow_rss_atom_feeds"
	| "allow_webhook_subscribers"
	| "notifications_from_email"
	| "time_zone"
	| "notifications_email_footer"
>;

export default class Pages {
	constructor(public statusPage: StatuspageApi) {}

	/**
	 * Get a list of pages
	 */
	async getAll(): Promise<Result<Page[], AuthenticationError>> {
		const result = await this.statusPage.ky.get("pages");
		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	/**
	 * Get a page
	 */
	async get(
		pageId: string
	): Promise<
		Result<
			Page,
			BadRequestError | AuthenticationError | ForbiddenError | NotFoundError
		>
	> {
		const result = await this.statusPage.ky.get(`pages/${pageId}`);
		if (!result.ok) return Result.err(await formatError(result));

		return Result.ok(await result.json());
	}

	/**
	 * Update a page
	 */
	async update<isReplace extends boolean>(
		/**
		 * The page to update
		 */
		pageId: string,
		/**
		 * Partial page object
		 */
		page: isReplace extends true ? PageUpdateData : Partial<PageUpdateData>,
		/**
		 * Should the page be replaced or patched
		 */
		replace?: isReplace
	): Promise<
		Result<
			Page,
			| BadRequestError
			| AuthenticationError
			| ForbiddenError
			| NotFoundError
			| UnprocessableEntityError
		>
	> {
		try {
			const result = await this.statusPage.ky[replace ? "put" : "patch"](
				`pages/${pageId}`,
				{
					json: { page },
				}
			);

			return Result.ok(await result.json());
		} catch (error) {
			return Result.err(await formatError(error));
		}
	}
}
