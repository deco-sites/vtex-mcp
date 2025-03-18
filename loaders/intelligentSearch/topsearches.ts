import { Suggestion } from "apps/commerce/types.ts";
import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";
import { getSegmentFromBag } from "site/sdk/segment.ts";

/**
 * @name intelligent_search_top_searches
 * @description Get the top searches from VTEX Catalog System. Uses the Intelligent Search API.
 */
export default async function (
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): Promise<Suggestion> {
  const segment = getSegmentFromBag(ctx);
  const locale = segment?.payload?.cultureInfo ?? "pt-BR";

  return await ctx.vcsDeprecated
    ["GET /api/io/_v/api/intelligent-search/top_searches"]({
      locale,
    }, { ...STALE })
    .then((res) => res.json());
}
