import { Deco } from "@deco/deco";
import { mcpServer } from "@deco/mcp";
import { Hono } from "@hono/hono";
import manifest, { Manifest } from "./manifest.gen.ts";

const app = new Hono();
const deco = await Deco.init<Manifest>({
  manifest,
});
const envPort = Deno.env.get("PORT");

app.use(
  "/*",
  mcpServer(deco, {
    exclude: [
      "website/loaders/asset.ts",
      "website/loaders/extension.ts",
      "website/loaders/fonts/googleFonts.ts",
      "website/loaders/fonts/local.ts",
      "website/loaders/image.ts",
      "website/loaders/options/routes.ts",
      "website/loaders/options/urlParams.ts",
      "website/loaders/pages.ts",
      "website/loaders/redirect.ts",
      "website/loaders/redirects.ts",
      "website/loaders/redirectsFromCsv.ts",
      "website/loaders/secret.ts",
      "website/loaders/secretString.ts",
      "website/actions/secrets/encrypt.ts",
    ],
  }),
);
app.all("/*", async (c) => c.res = await deco.fetch(c.req.raw));

Deno.serve({ handler: app.fetch, port: envPort ? +envPort : 8000 });
