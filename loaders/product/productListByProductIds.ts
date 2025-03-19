import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";
import { getSegmentFromBag } from "site/sdk/segment.ts";
import { isFilterParam } from "apps/vtex/utils/legacy.ts";

export interface Props {
  /**
   * @description Product ids to retrieve
   */
  productIds: string[];
  /**
   * @description Include similar products
   * @deprecated Use product extensions instead
   */
  similars?: boolean;
}

/**
 * @name productlist_by_product_ids
 * @description Get a list of products by product IDs
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const { vcsDeprecated } = ctx;

  if (!props.productIds || props.productIds.length === 0) {
    throw new Error("At least one product ID is required");
  }

  const params = {
    fq: props.productIds.map((productId) => `productId:${productId}`),
    _from: 0,
    _to: Math.max(props.productIds.length - 1, 0),
  };

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

  const segment = getSegmentFromBag(ctx)?.token ?? "";
  const productIds = [...props.productIds || []].sort();

  const params = new URLSearchParams([
    ["productids", productIds.join(",")],
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
