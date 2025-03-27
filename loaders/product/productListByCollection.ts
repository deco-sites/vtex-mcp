import { STALE } from "apps/utils/fetch.ts";
import { isFilterParam } from "apps/vtex/utils/legacy.ts";
import type { LegacyProduct, LegacySort } from "apps/vtex/utils/types.ts";
import { AppContext } from "site/apps/site.ts";
import { ProductProperties } from "site/sdk/vcs.ts";

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
  /**
   * @title Select specific properties to return
   * @name select_properties
   * @description Select specific properties to return. Values: - all (returns all properties) - allSpecifications - allSpecificationsGroups - brand - brandId - brandImageUrl - cacheId - categories - categoriesIds - categoryId - clusterHighlights - description - items - link - linkText - metaTagDescription - origin - priceRange - productClusters - productId - productName - productReference - productTitle - properties - releaseDate - selectedProperties - skuSpecifications - specificationGroups
   */
  select: (
    | "all"
    | "allSpecifications"
    | "allSpecificationsGroups"
    | "brand"
    | "brandId"
    | "brandImageUrl"
    | "cacheId"
    | "categories"
    | "categoriesIds"
    | "categoryId"
    | "clusterHighlights"
    | "description"
    | "items"
    | "link"
    | "linkText"
    | "metaTagDescription"
    | "origin"
    | "priceRange"
    | "productClusters"
    | "productId"
    | "productName"
    | "productReference"
    | "productTitle"
    | "properties"
    | "releaseDate"
    | "selectedProperties"
    | "skuSpecifications"
    | "specificationGroups"
  )[];
}

/**
 * @name product_list_by_collection
 * @description Get a list of products by collection ID
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<LegacyProduct[]> => {
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

  const partialProducts = props.select?.length && !props.select.includes("all")
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

  const params = new URLSearchParams([
    ["collection", props.collection || ""],
    ["count", (props.count || 12).toString()],
    ["sort", props.sort || ""],
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
