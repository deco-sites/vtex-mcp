import { STALE } from "apps/utils/fetch.ts";
import { isFilterParam } from "apps/vtex/utils/legacy.ts";
import { AppContext } from "site/apps/site.ts";
import { getSegmentFromBag } from "site/sdk/segment.ts";

export interface Props {
  /**
   * @description SKU ids to retrieve
   */
  ids: string[];
  /**
   * @description Include similar products
   * @deprecated Use product extensions instead
   */
  similars?: boolean;
}

/**
 * @name product_list_by_sku_ids
 * @description Get a list of products by SKU IDs
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const { vcsDeprecated } = ctx;

  if (!props.ids || props.ids.length === 0) {
    throw new Error("At least one SKU ID is required");
  }

  const params = {
    fq: props.ids.map((skuId) => `skuId:${skuId}`),
    _from: 0,
    _to: Math.max(props.ids.length - 1, 0),
  } as {
    _from?: number;
    _to?: number;
    fq: string[];
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
  const skuIds = [...props.ids || []].sort();

  const params = new URLSearchParams([
    ["skuids", skuIds.join(",")],
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
