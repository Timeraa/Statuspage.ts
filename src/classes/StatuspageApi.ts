import ky from "ky-universal";

import Components from "./Components.js";
import Incidents from "./Incidents.js";
import IncidentUpdates from "./IncidentUpdates.js";
import Metrics from "./Metrics.js";
import MetricsProvider from "./MetricsProvider.js";
import Pages from "./Pages.js";

export default class StatuspageApi {
	ky: typeof ky;

	pages = new Pages(this);
	incidents = new Incidents(this);
	incidentUpdates = new IncidentUpdates(this);
	metrics = new Metrics(this);
	metricsProvider = new MetricsProvider(this);
	components = new Components(this);

	constructor(public apiKey: string) {
		this.ky = ky.create({
			headers: {
				Authorization: apiKey,
			},
			prefixUrl: "https://api.statuspage.io/v1/",
			throwHttpErrors: false,
		});
	}
}
