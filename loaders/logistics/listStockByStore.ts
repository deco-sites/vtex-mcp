import type { ProductBalance } from "apps/vtex/utils/types.ts";
import type { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  /**
   * @description Product SKU
   */
  skuId: number;
  /**
   * @description The account name
   */
  accountName: string;
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
  const { skuId, accountName } = props;
  const vcs = getClient(accountName, ctx);

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
