import { STALE } from "apps/utils/fetch.ts";
import { isFilterParam } from "apps/vtex/utils/legacy.ts";
import { AppContext } from "site/apps/site.ts";

export interface Props {
  /**
   * @description SKU ID to get inventory for
   */
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
  const { vcs } = ctx;
  const { skuId } = props;

  if (!skuId) {
    throw new Error("SKU ID is required");
  }

  try {
    const response = await vcs["GET /api/logistics/pvt/inventory/skus/{skuId}"](
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

export const cacheKey = (
  props: Props,
  req: Request,
) => {
  const url = new URL(req.url);

  const params = new URLSearchParams([
    ["skuId", props.skuId],
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
