import { STALE } from "apps/utils/fetch.ts";
import { isFilterParam } from "apps/vtex/utils/legacy.ts";
import type { LegacySort } from "apps/vtex/utils/types.ts";
import { AppContext } from "site/apps/site.ts";

export interface Props {
  /**
   * @description Collection ID or (Product Cluster id).
   */
  collection: string;
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
   */
  similars?: boolean;
}

/**
 * @name product_list_by_collection
 * @description Get a list of products by collection ID
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const { vcsDeprecated } = ctx;

  if (!props.collection) {
    throw new Error("Collection ID is required");
  }

  const params = {
    fq: [`productClusterIds:${props.collection}`],
    _from: 0,
    _to: Math.max((props.count || 12) - 1, 0),
  } as {
    _from?: number;
    _to?: number;
    fq: string[];
    O?: LegacySort;
  };

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

  // Avoid cache on loader call over call
  if (ctx.isInvoke) {
    return null;
  }

  const params = new URLSearchParams([
    ["collection", props.collection || ""],
    ["count", (props.count || 12).toString()],
    ["sort", props.sort || ""],
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
