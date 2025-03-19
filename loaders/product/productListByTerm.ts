import { STALE } from "apps/utils/fetch.ts";
import type { LegacySort } from "apps/vtex/utils/types.ts";
import { AppContext } from "site/apps/site.ts";
import { getSegmentFromBag } from "site/sdk/segment.ts";
import { isFilterParam } from "apps/vtex/utils/legacy.ts";

export interface Props {
  /**
   * @description term to use on search
   */
  term?: string;
  /**
   * @description search sort parameter
   */
  sort?: LegacySort;
  /**
   * @description total number of items to display
   */
  count: number;
  /**
   * @description Include similar products
   * @deprecated Use product extensions instead
   */
  similars?: boolean;
}

/**
 * @name product_list_by_term
 * @description Get a list of products by search term
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const { vcsDeprecated } = ctx;

  const params = {
    _from: 0,
    _to: Math.max((props.count || 12) - 1, 0),
    fq: props.term ? [encodeURIComponent(props.term)] : [],
  } as {
    _from?: number;
    _to?: number;
    fq: string[];
    ft?: string;
    O?: LegacySort;
  };

  if (props.term) {
    params.ft = encodeURIComponent(props.term);
  }

  if (props.sort) {
    params.O = props.sort;
  }

  const vtexProducts = await vcsDeprecated
    ["GET /api/catalog_system/pub/products/search/:term?"]({
      ...params,
    }, { ...STALE })
    .then((res) => res.json());

  if (vtexProducts && !Array.isArray(vtexProducts)) {
    throw new Error(
      `Error while fetching VTEX data ${JSON.stringify(vtexProducts)}`,
    );
  }

  return vtexProducts;
};

export const cache = "stale-while-revalidate";

export const cacheKey = (
  props: Props,
  req: Request,
  ctx: AppContext,
) => {
  const url = new URL(req.url);

  // Avoid cache on loader call over call and on search pages with query parameter
  if ((!props.term && url.searchParams.has("q")) || ctx.isInvoke) {
    return null;
  }

  const segment = getSegmentFromBag(ctx)?.token ?? "";
  const params = new URLSearchParams([
    ["term", props.term ?? ""],
    ["count", (props.count || 12).toString()],
    ["sort", props.sort || ""],
    ["segment", segment],
  ]);

  url.searchParams.forEach((value, key) => {
    if (!isFilterParam(key)) return;
    params.append(key, value);
  });

  params.sort();
  url.search = params.toString();

  return url.href;
};

export default loader;
