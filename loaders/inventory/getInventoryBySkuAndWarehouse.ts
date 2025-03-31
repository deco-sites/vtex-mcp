import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  accountName: string;
  skuId: string;
  warehouseId: string;
}

/**
 * @name inventory_by_sku_and_warehouse
 * @description Get inventory information for a specific SKU in a specific warehouse
 */
const loader = async (
  props: Props,
  _req: Request,
  _ctx: AppContext,
) => {
  const { skuId, warehouseId, accountName } = props;
  const vcs = getClient(accountName);

  if (!skuId) {
    throw new Error("SKU ID is required");
  }

  if (!warehouseId) {
    throw new Error("Warehouse ID is required");
  }

  try {
    const response = await vcs
      ["GET /api/logistics/pvt/inventory/items/{skuId}/warehouses/{warehouseId}"](
        { skuId, warehouseId },
        { ...STALE },
      );

    return response;
  } catch (error) {
    console.error("Error fetching inventory by SKU and warehouse:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch inventory by SKU and warehouse");
  }
};

export const cache = "stale-while-revalidate";
export const cacheKey = (props: Props) =>
  `inventory_sku_${props.skuId}_warehouse_${props.warehouseId}`;

export default loader;
