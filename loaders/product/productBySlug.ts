import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";
import { getSegmentFromBag } from "site/sdk/segment.ts";
import { withIsSimilarTo } from "site/sdk/withIsSimilarTo.ts";

export interface Props {
  slug: string;
  /**
   * @description Include similar products
   * @deprecated Use product extensions instead
   */
  similars?: boolean;
}

/**
 * @name product_by_slug
 * @description Get product by slug from VTEX Catalog System
 */
async function loader(
  props: Props,
  req: Request,
  ctx: AppContext,
) {
  const { vcsDeprecated } = ctx;
  const { slug } = props;

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

  return {
    ...product,
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
  ]);

  params.sort();

  url.search = params.toString();

  return url.href;
};

export default loader;
