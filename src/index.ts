import { Router } from 'itty-router'
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

const router = Router()

/*
Our index route, a simple hello world.
*/
router.get("/", () => {
	return new Response("Hello, world! This is the root page of your Worker template.")
})

router.get("/example/:text", ({params}) => {
	// Decode text like "Hello%20world" into "Hello world"
	if(!params?.text){
		return new Response(`missing text`, {
			headers: {
				"Content-Type": "text/html"
			}
		})
	}
	let input = decodeURIComponent(params?.text)

	// Construct a buffer from our input
	let buffer = Buffer.from(input, "utf8")

	// Serialise the buffer into a base64 string
	let base64 = buffer.toString("base64")

	// Return the HTML with the string to the client
	return new Response(`<p>Base64 encoding: <code>${base64}</code></p>`, {
		headers: {
			"Content-Type": "text/html"
		}
	})
})

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		return router.handle(request);
	}
};
