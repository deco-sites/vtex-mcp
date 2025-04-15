import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  accountName: string;
}

/**
 * @name promotions_list
 * @description Lists all promotions in your store
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const vcs = getClient(props.accountName, ctx);

  try {
    const response = await vcs
      ["GET /api/rnb/pvt/benefits/calculatorconfiguration"](
        {},
        { ...STALE },
      );

    return response;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch promotions");
  }
};

export const cache = "stale-while-revalidate";
export const cacheKey = (props: Props) => `promotions_${props.accountName}`;

export default loader;
