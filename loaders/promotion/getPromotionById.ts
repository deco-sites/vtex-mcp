import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  accountName: string;
  promotionId: string;
}

/**
 * @name promotion_by_id
 * @description Get a specific promotion by its ID
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const { promotionId, accountName } = props;
  const vcs = getClient(accountName, ctx);

  if (!promotionId) {
    throw new Error("Promotion ID is required");
  }

  try {
    const response = await vcs
      ["GET /api/rnb/pvt/calculatorconfiguration/:idCalculatorConfiguration"](
        { idCalculatorConfiguration: promotionId },
        { ...STALE },
      );

    return response;
  } catch (error) {
    console.error("Error fetching promotion by ID:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch promotion by ID");
  }
};

export const cache = "stale-while-revalidate";
export const cacheKey = (props: Props) =>
  `promotion_${props.promotionId}_${props.accountName}`;

export default loader;
