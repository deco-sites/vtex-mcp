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
  // @ts-ignore ignore mcpServer type error
  mcpServer(deco, {
    exclude: [
      // @ts-ignore ignore asset loader type error
      "website/loaders/asset.ts",
      // @ts-ignore ignore extension loader type error
      "website/loaders/extension.ts",
      // @ts-ignore ignore googleFonts loader type error
      "website/loaders/fonts/googleFonts.ts",
      // @ts-ignore ignore local loader type error
      "website/loaders/fonts/local.ts",
      // @ts-ignore ignore image loader type error
      "website/loaders/image.ts",
      // @ts-ignore ignore options routes loader type error
      "website/loaders/options/routes.ts",
      // @ts-ignore ignore options urlParams loader type error
      "website/loaders/options/urlParams.ts",
      // @ts-ignore ignore pages loader type error
      "website/loaders/pages.ts",
      // @ts-ignore ignore redirect loader type error
      "website/loaders/redirect.ts",
      // @ts-ignore ignore redirects loader type error
      "website/loaders/redirects.ts",
      // @ts-ignore ignore redirectsFromCsv loader type error
      "website/loaders/redirectsFromCsv.ts",
      // @ts-ignore ignore secret loader type error
      "website/loaders/secret.ts",
      // @ts-ignore ignore secretString loader type error
      "website/loaders/secretString.ts",
      // @ts-ignore ignore secrets encrypt action type error
      "website/actions/secrets/encrypt.ts",
    ],
  }),
);
app.all("/*", async (c) => c.res = await deco.fetch(c.req.raw));

Deno.serve({ handler: app.fetch, port: envPort ? +envPort : 8000 });
