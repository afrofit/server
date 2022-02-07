import sanityClient from "@sanity/client";

const client = sanityClient({
	projectId: process.env.SANITY_PROJECT_ID,
	dataset: "production",
	apiVersion: process.env.SANITY_API_VERSION,
	token: process.env.SANITY_AUTH_TOKEN,
	useCdn: true,
});

export default client;
