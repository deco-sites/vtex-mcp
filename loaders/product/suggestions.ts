import { withSegmentCookie } from "apps/vtex/utils/segment.ts";
import { PortalSuggestion } from "apps/vtex/utils/types.ts";
import { AppContext } from "site/apps/site.ts";
import { getSegmentFromBag } from "site/sdk/segment.ts";

export interface Props {
  query?: string;
  /**
   * @description limit the number of searches
   * @default 4
   */
  count?: number;

  /**
   * @description Include similar products
   * @deprecated Use product extensions instead
   */
  similars?: boolean;
}

/**
 * @name suggestions
 * @description Get product suggestions from VTEX Catalog System
 */
const loaders = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<PortalSuggestion | null> => {
  const { vcsDeprecated } = ctx;
  const { count = 4, query } = props;
  const segment = getSegmentFromBag(ctx);

  const suggestions = await vcsDeprecated["GET /buscaautocomplete"](
    {
      maxRows: count,
      productNameContains: encodeURIComponent(query ?? ""),
      suggestionsStack: "",
    },
    {
      // Not adding suggestions to cache since queries are very spread out
      // deco: { cache: "stale-while-revalidate" },
      headers: withSegmentCookie(segment),
    },
  ).then((res) => res.json());

  return suggestions;
};

export default loaders;
