import { STALE } from "apps/utils/fetch.ts";
import { LegacyProduct } from "apps/vtex/utils/types.ts";
import type { AppContext } from "site/apps/site.ts";
import { getSegmentFromBag } from "site/sdk/segment.ts";
import type { ProductProperties } from "site/sdk/vcs.ts";
import { withIsSimilarTo } from "site/sdk/withIsSimilarTo.ts";

export interface Props {
  slug: string;
  /**
   * @description Include similar products
   * @deprecated Use product extensions instead
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
 * @name product_by_slug
 * @description Get product by slug from VTEX Catalog System
 */
async function loader(
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<LegacyProduct & { similars: LegacyProduct[] | null } | null> {
  const { vcsDeprecated } = ctx;
  const { slug, select } = props;

  const lowercaseSlug = slug?.toLowerCase() || "/";

  const response = await vcsDeprecated
    ["GET /api/catalog_system/pub/products/search/:slug/p"](
      { slug: lowercaseSlug },
      { ...STALE },
    ).then((res) => res.json());

  if (response && !Array.isArray(response)) {
    throw new Error(
      `Error while fetching VTEX data ${JSON.stringify(response)}`,
    );
  }

  const [product] = response;

  // Product not found, return the 404 status code
  if (!product) {
    return null;
  }

  const similars = props.similars
    ? await withIsSimilarTo(req, ctx, product.productId)
    : null;

  const partialProduct = select?.length && !select.includes("all")
    ? select.reduce((acc, prop) => {
      acc[prop] = product[prop];
      return acc;
      // deno-lint-ignore no-explicit-any
    }, {} as Record<ProductProperties, any>)
    : product;

  return {
    ...partialProduct,
    similars,
  };
}

export const cache = "stale-while-revalidate";

export const cacheKey = (props: Props, req: Request, ctx: AppContext) => {
  const url = new URL(req.url);

  if (url.searchParams.has("ft")) {
    return null;
  }
  // deno-lint-ignore no-explicit-any
  const segment = getSegmentFromBag(ctx as any)?.token ?? "";
  const skuId = url.searchParams.get("skuId") ?? "";

  const params = new URLSearchParams([
    ["slug", props.slug],
    ["segment", segment],
    ["skuId", skuId],
    ["select", props.select?.sort().join(",") ?? ""],
  ]);

  params.sort();

  url.search = params.toString();

  return url.href;
};

export default loader;
