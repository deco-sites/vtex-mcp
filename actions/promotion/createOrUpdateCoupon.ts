import { AppContext } from "site/apps/site.ts";
import { checkActionsEnabled } from "site/utils/actionGuard.ts";

export interface CouponData {
  utmSource: string;
  utmCampaign?: string;
  couponCode: string;
  isArchived?: boolean;
  maxItemsPerClient: number;
  expirationIntervalPerUse: string;
  maxUsage?: number;
}

export interface Props {
  coupon: CouponData;
}

/**
 * @name create_or_update_coupon
 * @description Creates a new coupon or updates an existing one in the VTEX Promotions & Taxes API
 */
async function action(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  // Check if actions are disabled before proceeding
  checkActionsEnabled(ctx, "create_or_update_coupon");

  const { vcs } = ctx;
  const { coupon } = props;

  try {
    // Validate required fields according to the API
    if (!coupon.utmSource) {
      throw new Error("UTM source is required");
    }

    if (!coupon.couponCode) {
      throw new Error("Coupon code is required");
    }

    if (coupon.maxItemsPerClient === undefined) {
      throw new Error("Maximum items per client is required");
    }

    if (!coupon.expirationIntervalPerUse) {
      throw new Error("Expiration interval per use is required");
    }

    const response = await vcs["POST /api/rnb/pvt/coupon"](
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: coupon,
      },
    ).then((res) => res.json());

    return response;
  } catch (error: unknown) {
    console.error("Error creating/updating coupon:", error);

    return error instanceof Error
      ? error.message
      : "Failed to create/update coupon";
  }
}

export default action;
