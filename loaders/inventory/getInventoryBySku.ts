import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  accountName: string;
  skuId: string;
}

/**
 * @name inventory_by_sku
 * @description Get inventory information for a specific SKU across all warehouses
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const { skuId, accountName } = props;
  const vcs = getClient(accountName, ctx);

  if (!skuId) {
    throw new Error("SKU ID is required");
  }

  try {
    const response = await vcs
      ["GET /api/logistics/pvt/inventory/skus/{skuId}"](
        { skuId },
        { ...STALE },
      );

    return response;
  } catch (error) {
    console.error("Error fetching inventory by SKU:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch inventory by SKU");
  }
};

export const cache = "stale-while-revalidate";
export const cacheKey = (props: Props) =>
  `inventory_sku_${props.skuId}_${props.accountName}`;

export default loader;
