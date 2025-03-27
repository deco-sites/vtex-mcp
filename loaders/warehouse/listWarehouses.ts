import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";

/**
 * @name warehouses_list
 * @description Lists all warehouses set up in your store
 */
const loader = async (
  _props: unknown,
  _req: Request,
  ctx: AppContext,
) => {
  const { vcs } = ctx;

  try {
    const response = await vcs
      ["GET /api/logistics/pvt/configuration/warehouses"](
        {},
        { ...STALE },
      );

    return response;
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch warehouses");
  }
};

export const cache = "stale-while-revalidate";
export const cacheKey = () => "warehouses";

export default loader;
