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
  couponCode: string;
}

/**
 * @name coupon_by_code
 * @description Get a specific coupon by its code
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const { couponCode, accountName } = props;
  const vcs = getClient(accountName, ctx);

  if (!couponCode) {
    throw new Error("Coupon code is required");
  }

  try {
    const response = await vcs
      ["GET /api/rnb/pvt/coupon/:couponCode"](
        { couponCode },
        { ...STALE },
      );

    return response;
  } catch (error) {
    console.error("Error fetching coupon by code:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch coupon by code");
  }
};

export const cache = "stale-while-revalidate";
export const cacheKey = (props: Props) =>
  `coupon_${props.couponCode}_${props.accountName}`;

export default loader;
