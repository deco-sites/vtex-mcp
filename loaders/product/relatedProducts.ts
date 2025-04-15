import { STALE } from "apps/utils/fetch.ts";
import { batch } from "apps/vtex/utils/batch.ts";
import { pickSku } from "apps/vtex/utils/transform.ts";
import type { CrossSellingType, LegacyProduct } from "apps/vtex/utils/types.ts";
import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";
import productList from "./productListBySkuIds.ts";

export interface Props {
  /**
   * @title Related Products
   * @description VTEX Cross Selling API. This loader only works on routes of type /:slug/p
   */
  crossSelling: CrossSellingType;
  /**
   * @description: number of related products
   */
  count?: number;
  /**
   * @description the product slug
   */
  slug?: string;
  /**
   * @description ProductGroup ID
   */
  id?: string;
  /**
   * @description The account name
   */
  accountName: string;
}

/**
 * @name related_products
 * @description Get related products using product slug or product id, and cross selling type
 */
async function loader(
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<LegacyProduct[] | null> {
  const vcsDeprecated = getClient(props.accountName, ctx);
  const {
    crossSelling = "similars",
    count,
  } = props;

  const getProductGroupID = async (props: { slug?: string; id?: string }) => {
    const { id, slug } = props;

    if (id) {
      return id;
    }

    if (slug) {
      const pageType = await vcsDeprecated
        ["GET /api/catalog_system/pub/portal/pagetype/:term"]({
          term: `${slug}/p`,
        }, STALE).then((res) => res.json());

      // Page type doesn't exists or this is not product page
      if (pageType?.pageType === "Product") {
        return pageType.id;
      }
    }

    return null;
  };

  const productId = await getProductGroupID(props);

  if (!productId) {
    console.warn(`Could not find product for props: ${JSON.stringify(props)}`);

    return null;
  }

  const products = await vcsDeprecated
    ["GET /api/catalog_system/pub/products/crossselling/:type/:productId"]({
      type: crossSelling,
      productId,
    }, { ...STALE })
    .then((res) => res.json());

  if (products && !Array.isArray(products)) {
    throw new Error(
      `Error while fetching VTEX data ${JSON.stringify(products)}`,
    );
  }

  // unique Ids
  const relatedIds = [...new Set(
    products.slice(0, count).map((p) => pickSku(p).itemId),
  ).keys()];

  /** Batch fetches due to VTEX API limits */
  const batchedIds = batch(relatedIds, 50);

  const relatedProductsResults = await Promise.allSettled(
    batchedIds.map((ids) =>
      productList(
        {
          similars: false,
          ids,
          accountName: props.accountName,
          select: ["all"],
        },
        req,
        ctx,
      )
    ),
  );

  const relatedProducts = relatedProductsResults
    .filter(
      (result): result is PromiseFulfilledResult<LegacyProduct[]> =>
        result.status === "fulfilled",
    )
    .flatMap((result) => result.value)
    .filter((x): x is LegacyProduct => Boolean(x));

  relatedProductsResults
    .filter((result) => result.status === "rejected")
    .forEach((result, index) => {
      console.error(
        `Error loading related products for batch ${index}:`,
        (result as PromiseRejectedResult).reason,
      );
    });

  return relatedProducts;
}

export default loader;
