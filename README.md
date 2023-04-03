# Statuspage.ts

Statuspage.ts is a simple library for interacting with the [Statuspage.io](https://statuspage.io) API.

> **NOTE:** This library may have bugs and is/can not be fully tested. Statuspage.io's documentation is pretty outdated as well so some types may not be correct. If you find any issues, please open an issue or PR.

## Why?

I wanted to create a simple library for interacting with the Statuspage API with Type Safety. I could not find any libraries that were up to date and/or had a good API. So I created this one.

## Important

**This libary does not have a automatic test suite as Statuspage's documentation is not accurate and I do not believe mocking the API is a good idea. Suggestions are welcome!**

## Installation

```bash
npm install statuspage.ts
```

## Usage

```js
const Statuspage = require("statuspage.ts");

const statuspage = new Statuspage("YOUR_API_KEY");

const result = await statuspage.incidents.getAll("YOUR_PAGE_ID");

// Check if the request was successful
if (!result.ok) {
	console.error(result.error);
	return;
} else {
	console.log(result.data);
}
```

```

### TODO

These functionalities are not yet implemented. If you would like to help, please open a PR.

- Change return types of objects to camelCase
- Convert date strings to unix timestamps
- [Subscribers](https://developer.statuspage.io/#tag/subscribers)
- [Templates](https://developer.statuspage.io/#tag/templates)
- [Incident Updates](https://developer.statuspage.io/#tag/templates)
- [Incident Subscribers](https://developer.statuspage.io/#tag/incident-subscribers)
- [Incident Postmortem](https://developer.statuspage.io/#tag/incident-postmortem)
- [Components](https://developer.statuspage.io/#tag/components)
  - [Remove Users Page Access](https://developer.statuspage.io/#operation/deletePagesPageIdComponentsComponentIdPageAccessUsers)
  - [Add Users Page Access](https://developer.statuspage.io/#operation/postPagesPageIdComponentsComponentIdPageAccessUsers)
  - [Add Groups Page Access](https://developer.statuspage.io/#operation/deletePagesPageIdComponentsComponentIdPageAccessGroups)
  - [Remove Groups Page Access](https://developer.statuspage.io/#operation/postPagesPageIdComponentsComponentIdPageAccessGroups)
- [Component Groups](https://developer.statuspage.io/#tag/component-groups)

### License

[MIT](LICENSE)

**This project does is not affiliated with Statuspage.io in any way.**
```
