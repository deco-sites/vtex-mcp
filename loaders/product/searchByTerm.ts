import { PortalSuggestion } from "apps/vtex/utils/types.ts";
import { AppContext } from "site/apps/site.ts";

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
 * @name search_by_term
 * @description Get product suggestions by term from VTEX Catalog System
 */
const loaders = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<PortalSuggestion | null> => {
  const { vcsDeprecated } = ctx;
  const { count = 4, query } = props;

  const suggestions = await vcsDeprecated["GET /buscaautocomplete"](
    {
      maxRows: count,
      productNameContains: encodeURIComponent(query ?? ""),
      suggestionsStack: "",
    },
  ).then((res) => res.json());

  return suggestions;
};

export default loaders;
