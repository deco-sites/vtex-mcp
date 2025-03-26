import { STALE } from "apps/utils/fetch.ts";
import { isFilterParam } from "apps/vtex/utils/legacy.ts";
import { LegacyProduct } from "apps/vtex/utils/types.ts";
import { AppContext } from "site/apps/site.ts";
import { getSegmentFromBag } from "site/sdk/segment.ts";
import { ProductProperties } from "site/sdk/vcs.ts";
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
  /**
   * @description Select specific properties to return. Values:
   * - allSpecifications
   * - allSpecificationsGroups
   * - brand
   * - brandId
   * - brandImageUrl
   * - cacheId
   * - categories
   * - categoriesIds
   * - categoryId
   * - clusterHighlights
   * - description
   * - items
   * - link
   * - linkText
   * - metaTagDescription
   * - origin
   * - priceRange
   * - productClusters
   * - productId
   * - productName
   * - productReference
   * - productTitle
   * - properties
   * - releaseDate
   * - selectedProperties
   * - skuSpecifications
   * - specificationGroups
   */
  select?: ProductProperties[];
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

  const partialProducts = props.select?.length
    ? vtexProducts.map((product) =>
      props.select!.reduce((acc, prop) => {
        acc[prop] = product[prop];
        return acc;
        // deno-lint-ignore no-explicit-any
      }, {} as Record<ProductProperties, any>)
    )
    : vtexProducts;

  return partialProducts as LegacyProduct[];
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
    ["select", props.select?.sort().join(",") ?? ""],
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
