import { AppContext } from "site/apps/site.ts";
import { checkActionsEnabled } from "site/utils/actionGuard.ts";

export interface PromotionSku {
  id: string;
  name: string;
}

export interface PromotionProduct {
  id: string;
  name: string;
}

export interface PromotionBrand {
  id: string;
  name: string;
}

export interface PromotionCategory {
  id: string;
  name: string;
}

export interface PromotionCollection {
  id: string;
  name: string;
}

export interface PromotionPaymentMethod {
  id: string;
  name: string;
}

export interface PromotionAffiliate {
  id: string;
  name: string;
}

export interface PromotionZipCodeRange {
  zipCodeFrom: string;
  zipCodeTo: string;
  inclusive: boolean;
}

export interface PromotionSkusGift {
  quantitySelectable: number;
  gifts?: string[];
}

export interface PromotionData {
  idCalculatorConfiguration?: string; // Optional for create, required for update
  name: string;
  description?: string;
  beginDateUtc: string;
  endDateUtc?: string;
  isActive: boolean;
  isArchived?: boolean;
  isFeatured?: boolean;
  activeDaysOfWeek?: string[];
  offset?: number;
  activateGiftsMultiplier?: boolean;
  newOffset?: number;
  cumulative?: boolean;
  discountType?: string;
  nominalShippingDiscountValue?: number;
  absoluteShippingDiscountValue?: number;
  nominalDiscountValue?: number;
  nominalDiscountType?: string;
  maximumUnitPriceDiscount?: number;
  percentualDiscountValue?: number;
  rebatePercentualDiscountValue?: number;
  percentualShippingDiscountValue: number; // Required
  percentualTax?: number;
  shippingPercentualTax?: number;
  percentualDiscountValueList1?: number;
  percentualDiscountValueList2?: number;
  skusGift?: PromotionSkusGift;
  nominalRewardValue?: number;
  percentualRewardValue?: number;
  orderStatusRewardValue?: string;
  maxNumberOfAffectedItems?: number;
  maxNumberOfAffectedItemsGroupKey?: string;
  applyToAllShippings?: boolean;
  nominalTax?: number;
  origin: string; // Required
  idSeller?: string;
  idSellerIsInclusive?: boolean;
  idsSalesChannel?: string[];
  areSalesChannelIdsExclusive?: boolean;
  marketingTags?: string[];
  marketingTagsAreNotInclusive?: boolean;
  paymentsMethods?: PromotionPaymentMethod[];
  campaigns?: string[];
  conditionsIds?: string[];
  categories?: PromotionCategory[];
  categoriesAreInclusive?: boolean;
  brands?: PromotionBrand[];
  brandsAreInclusive?: boolean;
  products?: PromotionProduct[];
  productsAreInclusive?: boolean;
  skus?: PromotionSku[];
  skusAreInclusive?: boolean;
  utmSource?: string;
  utmCampaign?: string;
  collections1BuyTogether?: PromotionCollection[];
  minimumQuantityBuyTogether?: number;
  quantityToAffectBuyTogether?: number;
  enableBuyTogetherPerSku?: boolean;
  listSku1BuyTogether?: PromotionSku[];
  listSku2BuyTogether?: PromotionSku[];
  totalValueFloor?: number;
  totalValueCeling?: number;
  totalValueMode?: string;
  collections?: PromotionCollection[];
  collectionsIsInclusive?: boolean;
  restrictionsBins?: string[];
  totalValuePurchase?: number;
  slasIds?: string[];
  isSlaSelected?: boolean;
  isFirstBuy?: boolean;
  firstBuyIsProfileOptimistic?: boolean;
  compareListPriceAndPrice?: boolean;
  isDifferentListPriceAndPrice?: boolean;
  zipCodeRanges?: PromotionZipCodeRange[];
  itemMaxPrice?: number;
  itemMinPrice?: number;
  isMinMaxInstallments?: boolean;
  minInstallment?: number;
  maxInstallment?: number;
  clusterExpressions?: string[];
  giftListTypes?: string[];
  affiliates?: PromotionAffiliate[];
  maxUsage?: number;
  maxUsagePerClient?: number;
  shouldDistributeDiscountAmongMatchedItems?: boolean;
  multipleUsePerClient?: boolean;
  accumulateWithManualPrice?: boolean;
  type: string; // Required
  useNewProgressiveAlgorithm?: boolean;
  percentualDiscountValueList?: number[];
}

export interface Props {
  promotion: PromotionData;
}

/**
 * @name create_or_update_promotion
 * @description Creates a new promotion or updates an existing one in the VTEX Promotions & Taxes API
 */
async function action(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  checkActionsEnabled(ctx, "create_or_update_promotion");

  const { vcs } = ctx;
  const { promotion } = props;

  try {
    // Validate required fields according to the API
    if (!promotion.name) {
      throw new Error("Promotion name is required");
    }

    if (!promotion.type) {
      throw new Error("Promotion type is required");
    }

    if (!promotion.beginDateUtc) {
      throw new Error("Begin date is required");
    }

    if (!promotion.isActive && promotion.isActive !== false) {
      throw new Error("isActive flag is required");
    }

    if (!promotion.origin) {
      throw new Error("Origin is required");
    }

    if (promotion.percentualShippingDiscountValue === undefined) {
      throw new Error("percentualShippingDiscountValue is required");
    }

    const response = await vcs["POST /api/rnb/pvt/calculatorconfiguration"](
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: promotion,
      },
    ).then((res) => res.json());

    return response;
  } catch (error: unknown) {
    console.error("Error creating/updating promotion:", error);

    return error instanceof Error
      ? error.message
      : "Failed to create/update promotion";
  }
}

export default action;
