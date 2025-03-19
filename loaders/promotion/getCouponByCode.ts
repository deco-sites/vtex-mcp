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

export interface Props {
  /**
   * @description The coupon code to retrieve
   */
  couponCode: string;
}

/**
 * @name get_coupon_by_code
 * @description Retrieves a specific coupon by its coupon code
 */
async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { vcs } = ctx;
  const { couponCode } = props;

  if (!couponCode) {
    throw new Error("Coupon code is required");
  }

  try {
    const coupon = await vcs["GET /api/rnb/pvt/coupon/{couponCode}"](
      { couponCode },
      { ...STALE },
    ).then((res) => res.json()) as Coupon;

    return {
      success: true,
      coupon,
    };
  } catch (error: unknown) {
    console.error(`Error fetching coupon with code ${couponCode}:`, error);

    if (error instanceof Response && error.status === 404) {
      return {
        success: false,
        error: `Coupon with code ${couponCode} not found`,
      };
    }

    throw new Error(
      error instanceof Error
        ? error.message
        : `Failed to fetch coupon with code ${couponCode}`,
    );
  }
}

export const cache = "stale-while-revalidate";

export const cacheKey = (props: Props) => `coupon-${props.couponCode}`;

export default loader;
