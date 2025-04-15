import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

export interface Coupon {
  lastModifiedUtc: string;
  utmSource: string;
  utmCampaign?: string;
  couponCode: string;
  isArchived: boolean;
  maxItemsPerClient: number;
  expirationIntervalPerUse: string;
  maxUsage?: number;
  groupingKey?: string;
}

interface Props {
  accountName: string;
}

/**
 * @name coupons_list
 * @description Lists all coupons in your store
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const vcs = getClient(props.accountName, ctx);

  try {
    const response = await vcs
      ["GET /api/rnb/pvt/coupon"](
        {},
        { ...STALE },
      );

    return response;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error instanceof Error ? error : new Error("Failed to fetch coupons");
  }
};

export const cache = "stale-while-revalidate";
export const cacheKey = (props: Props) => `coupons_${props.accountName}`;

export default loader;
