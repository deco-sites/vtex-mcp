import { AppContext } from "site/apps/site.ts";
import relatedProductsLoader from "../loaders/product/relatedProducts.ts";

export const withIsSimilarTo = async (
  req: Request,
  ctx: AppContext,
  productId: string,
) => {
  const similars = await relatedProductsLoader(
    {
      crossSelling: "similars",
      id: productId,
      accountName: ctx.account,
    },
    req,
    ctx,
  );

  return similars;
};
