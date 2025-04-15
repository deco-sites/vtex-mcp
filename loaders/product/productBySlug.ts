import { STALE } from "apps/utils/fetch.ts";
import { LegacyProduct } from "apps/vtex/utils/types.ts";
import type { AppContext } from "site/apps/site.ts";
import type { ProductProperties } from "site/sdk/vcs.ts";
import { withIsSimilarTo } from "site/sdk/withIsSimilarTo.ts";
import getClient from "site/utils/getClient.ts";

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
  /**
   * @description The account name
   */
  accountName: string;
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
  const vcsDeprecated = getClient(props.accountName, ctx);
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
      // @ts-ignore ignore
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

export default loader;
