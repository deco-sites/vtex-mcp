import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";

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

/**
 * @name list_coupons
 * @description Retrieves all coupons from the store
 */
async function loader(
  _props: unknown,
  _req: Request,
  ctx: AppContext,
) {
  const { vcs } = ctx;

  try {
    const coupons = await vcs["GET /api/rnb/pvt/coupon"](
      {},
      { ...STALE },
    ).then((res) => res.json()) as Coupon[];

    return {
      success: true,
      coupons: coupons,
    };
  } catch (error: unknown) {
    console.error("Error fetching coupons:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch coupons from VTEX",
    );
  }
}

export const cache = "stale-while-revalidate";
export const cacheKey = () => "coupons";

export default loader;
