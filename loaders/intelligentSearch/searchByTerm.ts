import { STALE } from "apps/utils/fetch.ts";
import {
  toPath,
  withDefaultFacets,
  withDefaultParams,
} from "apps/vtex/utils/intelligentSearch.ts";
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
 * @name intelligent_search_search_by_term
 * @description Get product suggestions from VTEX Catalog System. Uses the Intelligent Search API.
 */
const loaders = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const { vcsDeprecated } = ctx;
  const { count, query } = props;
  const locale = "pt-BR";

  const suggestions = () =>
    vcsDeprecated["GET /api/io/_v/api/intelligent-search/search_suggestions"]({
      locale,
      query: query ?? "",
    }).then((res) => res.json());

  const topSearches = () =>
    vcsDeprecated["GET /api/io/_v/api/intelligent-search/top_searches"]({
      locale,
    }, { ...STALE })
      .then((res) => res.json());

  const productSearch = () => {
    // deno-lint-ignore no-explicit-any
    const facets = withDefaultFacets([], ctx as any);
    const params = withDefaultParams({ query, count: count ?? 4, locale });

    return vcsDeprecated
      ["GET /api/io/_v/api/intelligent-search/product_search/*facets"]({
        ...params,
        facets: toPath(facets),
      }, { ...STALE })
      .then((res) => res.json());
  };

  const [{ searches }, { products, recordsFiltered }] = await Promise.all([
    query ? suggestions() : topSearches(),
    productSearch(),
  ]);

  if (!searches || !productSearch) return null;

  return {
    searches: count ? searches.slice(0, count) : searches,
    products,
    hits: recordsFiltered,
  };
};

export default loaders;
