import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  accountName: string;
}

/**
 * @name warehouses_list
 * @description Lists all warehouses set up in your store
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const vcs = getClient(props.accountName, ctx);

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
export const cacheKey = (props: Props) => `warehouses_${props.accountName}`;

export default loader;
