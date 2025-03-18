import type { AppContext } from "site/apps/site.ts";
import type { ProductBalance } from "apps/vtex/utils/types.ts";

interface Props {
  /**
   * @description Product SKU
   */
  skuId: number;
}

/**
 * @name list_stock_by_store
 * @description List sku stock by store
 */
export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<ProductBalance[]> {
  const { skuId } = props;
  const { vcs } = ctx;

  try {
    const stockByStore = await vcs
      ["GET /api/logistics/pvt/inventory/skus/:skuId"]({ skuId })
      .then((r) => r.json()) as {
        skuId?: string;
        balance?: ProductBalance[];
      };

    return stockByStore.balance || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
