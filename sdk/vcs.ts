import type { OpenAPI } from "apps/vtex/utils/openapi/vcs.openapi.gen.ts";
import type { LegacyProduct } from "apps/vtex/utils/types.ts";

export type ProductProperties = keyof LegacyProduct;

export interface VCS extends OpenAPI {
  "GET /api/oms/pvt/orders": {
    searchParams: {
      orderBy?: string;
      page?: number;
      per_page?: number;
      f_hasInputInvoice?: boolean;
      q?: string;
      f_shippingEstimate?: string;
      f_invoicedDate?: string;
      f_creationDate?: string;
      f_authorizedDate?: string;
      f_UtmSource?: string;
      f_sellerNames?: string;
      f_callCenterOperatorName?: string;
      f_salesChannel?: string;
      salesChannelId?: string;
      f_affiliateId?: string;
      f_status?: string;
      incompleteOrders?: boolean;
      f_paymentNames?: string;
      f_RnB?: string;
      searchField?: string;
      f_isInstore?: boolean;
    };
    response: {
      list: {
        orderId: string;
        creationDate: string;
        clientName: string;
        items: Array<{
          id: string;
          name: string;
          price: number;
          quantity: number;
        }>;
        totalValue: number;
        paymentNames: string;
        status: string;
        statusDescription: string;
        marketPlaceOrderId?: string;
        sequence: string;
        salesChannel: string;
        affiliateId?: string;
        origin: string;
        workflowInErrorState: boolean;
        workflowInRetry: boolean;
        lastMessageUnread: string;
        ShippingEstimatedDate?: string;
        ShippingEstimatedDateMax?: string;
        ShippingEstimatedDateMin?: string;
        orderIsComplete: boolean;
        listId?: string;
        listType?: string;
      }[];
      paging: {
        total: number;
        pages: number;
        currentPage: number;
        perPage: number;
      };
    };
  };

  "PUT /api/catalog/pvt/product/:productId": {
    body: {
      Name: string;
      CategoryPath: string;
      BrandId: number;
      LinkId?: string;
      RefId?: string;
      IsVisible?: boolean;
      Description?: string;
      DescriptionShort?: string;
      ReleaseDate?: string;
      KeyWords?: string;
      Title?: string;
      IsActive?: boolean;
      TaxCode?: string;
      MetaTagDescription?: string;
      SupplierId?: number;
      ShowWithoutStock?: boolean;
      AdWordsRemarketingCode?: string;
      LomadeeCampaignCode?: string;
      Score?: number;
      CategoryId: number;
    };
    response: {
      Id: number;
      Name: string;
      DepartmentId: number;
      CategoryId: number;
      BrandId: number;
      LinkId: string;
      RefId: string;
      IsVisible: boolean;
      Description: string;
      DescriptionShort: string;
      ReleaseDate: string;
      KeyWords: string;
      Title: string;
      IsActive: boolean;
      TaxCode: string;
      MetaTagDescription: string;
      SupplierId: number;
      ShowWithoutStock: boolean;
      AdWordsRemarketingCode: string;
      LomadeeCampaignCode: string;
      Score: number;
    };
  };
  "PUT /api/catalog/pvt/product/:productId/specification": {
    body: {
      SpecificationId: number;
      FieldValues: string[];
    }[];
    response: {
      Id: number;
      ProductId: number;
      SpecificationId: number;
      Name: string;
      Value: string[];
    }[];
  };

  "GET /api/rnb/pvt/benefits/calculatorconfiguration": {
    response: {
      limitConfigurationMaxPrice: {
        activesCount: number;
        limit: number;
      };
      limitConfiguration: {
        activesCount: number;
        limit: number;
      };
      items: Array<{
        idCalculatorConfiguration: string;
        lastModifiedUtc: string;
        name: string;
        beginDate?: string;
        endDate?: string;
        isActive: boolean;
        description?: string;
        type: string;
        utmSource?: string;
        utmCampain?: string;
        utmiCampaign?: string;
        nominalDiscountType?: string;
        status: string;
        percentualTax?: number;
        isArchived: boolean;
        hasMaxPricePerItem: boolean;
        isTax: boolean;
        Campaigns: string[];
        conditionsIds?: string[];
        activateGiftsMultiplier: boolean;
        scope: {
          allCatalog: boolean;
          skus: number;
          skusAreInclusive: boolean;
          products: number;
          productsAreInclusive: boolean;
          collections: number;
          collectionsAreInclusive: boolean;
          categories: number;
          categoriesAreInclusive: boolean;
          brands: number;
          brandsAreInclusive: boolean;
          sellers: number;
          sellersAreInclusive: boolean;
        };
        maxUsage: number;
        idsSalesChannel: string[];
        areSalesChannelIdsExclusive: boolean;
      }>;
      disabledItems: string[];
      archivedItems: string[];
      nominalDiscountType?: string;
    };
  };

  "POST /api/rnb/pvt/calculatorconfiguration": {
    body: {
      idCalculatorConfiguration?: string;
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
      percentualShippingDiscountValue: number;
      percentualTax?: number;
      shippingPercentualTax?: number;
      percentualDiscountValueList1?: number;
      percentualDiscountValueList2?: number;
      skusGift?: {
        quantitySelectable: number;
        gifts?: string[];
      };
      nominalRewardValue?: number;
      percentualRewardValue?: number;
      orderStatusRewardValue?: string;
      maxNumberOfAffectedItems?: number;
      maxNumberOfAffectedItemsGroupKey?: string;
      applyToAllShippings?: boolean;
      nominalTax?: number;
      origin: string;
      idSeller?: string;
      idSellerIsInclusive?: boolean;
      idsSalesChannel?: string[];
      areSalesChannelIdsExclusive?: boolean;
      marketingTags?: string[];
      marketingTagsAreNotInclusive?: boolean;
      paymentsMethods?: Array<{
        id: string;
        name: string;
      }>;
      campaigns?: string[];
      conditionsIds?: string[];
      categories?: Array<{
        id: string;
        name: string;
      }>;
      categoriesAreInclusive?: boolean;
      brands?: Array<{
        id: string;
        name: string;
      }>;
      brandsAreInclusive?: boolean;
      products?: Array<{
        id: string;
        name: string;
      }>;
      productsAreInclusive?: boolean;
      skus?: Array<{
        id: string;
        name: string;
      }>;
      skusAreInclusive?: boolean;
      utmSource?: string;
      utmCampaign?: string;
      collections1BuyTogether?: Array<{
        id: string;
        name: string;
      }>;
      minimumQuantityBuyTogether?: number;
      quantityToAffectBuyTogether?: number;
      enableBuyTogetherPerSku?: boolean;
      listSku1BuyTogether?: Array<{
        id: string;
        name: string;
      }>;
      listSku2BuyTogether?: Array<{
        id: string;
        name: string;
      }>;
      totalValueFloor?: number;
      totalValueCeling?: number;
      totalValueMode?: string;
      collections?: Array<{
        id: string;
        name: string;
      }>;
      collectionsIsInclusive?: boolean;
      restrictionsBins?: string[];
      totalValuePurchase?: number;
      slasIds?: string[];
      isSlaSelected?: boolean;
      isFirstBuy?: boolean;
      firstBuyIsProfileOptimistic?: boolean;
      compareListPriceAndPrice?: boolean;
      isDifferentListPriceAndPrice?: boolean;
      zipCodeRanges?: Array<{
        zipCodeFrom: string;
        zipCodeTo: string;
        inclusive: boolean;
      }>;
      itemMaxPrice?: number;
      itemMinPrice?: number;
      isMinMaxInstallments?: boolean;
      minInstallment?: number;
      maxInstallment?: number;
      clusterExpressions?: string[];
      giftListTypes?: string[];
      affiliates?: Array<{
        id: string;
        name: string;
      }>;
      maxUsage?: number;
      maxUsagePerClient?: number;
      shouldDistributeDiscountAmongMatchedItems?: boolean;
      multipleUsePerClient?: boolean;
      accumulateWithManualPrice?: boolean;
      type: string;
      useNewProgressiveAlgorithm?: boolean;
      percentualDiscountValueList?: number[];
    };
    response: {
      idCalculatorConfiguration: string;
      name: string;
      description?: string;
      beginDateUtc: string;
      endDateUtc?: string;
      lastModified: string;
      daysAgoOfPurchases: number;
      isActive: boolean;
      isArchived: boolean;
      isFeatured: boolean;
      disableDeal: boolean;
      activeDaysOfWeek: string[];
      offset: number;
      activateGiftsMultiplier: boolean;
      newOffset: number;
      maxPricesPerItems: string[];
      cumulative: boolean;
      discountType: string;
      nominalShippingDiscountValue: number;
      absoluteShippingDiscountValue: number;
      nominalDiscountValue: number;
      nominalDiscountType?: string;
      maximumUnitPriceDiscount: number;
      percentualDiscountValue: number;
      rebatePercentualDiscountValue: number;
      percentualShippingDiscountValue: number;
      percentualTax: number;
      shippingPercentualTax: number;
      percentualDiscountValueList1: number;
      percentualDiscountValueList2: number;
      skusGift: {
        quantitySelectable: number;
        gifts?: string[];
      };
      nominalRewardValue: number;
      percentualRewardValue: number;
      orderStatusRewardValue: string;
      maxNumberOfAffectedItems: number;
      maxNumberOfAffectedItemsGroupKey: string;
      applyToAllShippings: boolean;
      nominalTax: number;
      origin: string;
      idSeller?: string;
      idSellerIsInclusive: boolean;
      idsSalesChannel: string[];
      areSalesChannelIdsExclusive: boolean;
      marketingTags: string[];
      marketingTagsAreNotInclusive: boolean;
      paymentsMethods: Array<{
        id: string;
        name: string;
      }>;
      stores: string[];
      campaigns: string[];
      conditionsIds: string[];
      storesAreInclusive: boolean;
      categories: Array<{
        id: string;
        name: string;
      }>;
      categoriesAreInclusive: boolean;
      brands: Array<{
        id: string;
        name: string;
      }>;
      brandsAreInclusive: boolean;
      products: Array<{
        id: string;
        name: string;
      }>;
      productsAreInclusive: boolean;
      skus: Array<{
        id: string;
        name: string;
      }>;
      skusAreInclusive: boolean;
      utmSource: string;
      utmCampaign: string;
      collections1BuyTogether: Array<{
        id: string;
        name: string;
      }>;
      collections2BuyTogether: Array<{
        id: string;
        name: string;
      }>;
      minimumQuantityBuyTogether: number;
      quantityToAffectBuyTogether: number;
      enableBuyTogetherPerSku: boolean;
      listSku1BuyTogether: Array<{
        id: string;
        name: string;
      }>;
      listSku2BuyTogether: Array<{
        id: string;
        name: string;
      }>;
      coupon: string[];
      totalValueFloor: number;
      totalValueCeling: number;
      totalValueIncludeAllItems: boolean;
      totalValueMode: string;
      collections: Array<{
        id: string;
        name: string;
      }>;
      collectionsIsInclusive: boolean;
      restrictionsBins: string[];
      cardIssuers: string[];
      totalValuePurchase: number;
      slasIds: string[];
      isSlaSelected: boolean;
      isFirstBuy: boolean;
      firstBuyIsProfileOptimistic: boolean;
      compareListPriceAndPrice: boolean;
      isDifferentListPriceAndPrice: boolean;
      zipCodeRanges: Array<{
        zipCodeFrom: string;
        zipCodeTo: string;
        inclusive: boolean;
      }>;
      itemMaxPrice: number;
      itemMinPrice: number;
      installment: number;
      isMinMaxInstallments: boolean;
      minInstallment: number;
      maxInstallment: number;
      merchants: string[];
      clusterExpressions: string[];
      paymentsRules: string[];
      giftListTypes: string[];
      productsSpecifications: string[];
      affiliates: Array<{
        id: string;
        name: string;
      }>;
      maxUsage: number;
      maxUsagePerClient: number;
      shouldDistributeDiscountAmongMatchedItems: boolean;
      multipleUsePerClient: boolean;
      accumulateWithManualPrice: boolean;
      type: string;
      useNewProgressiveAlgorithm: boolean;
      percentualDiscountValueList: number[];
    };
  };

  "GET /api/rnb/pvt/coupon": {
    response: Array<{
      lastModifiedUtc: string;
      utmSource: string;
      utmCampaign?: string;
      couponCode: string;
      isArchived: boolean;
      maxItemsPerClient: number;
      expirationIntervalPerUse: string;
      maxUsage?: number;
      groupingKey?: string;
    }>;
  };

  "POST /api/rnb/pvt/coupon": {
    body: {
      utmSource: string;
      utmCampaign?: string;
      couponCode: string;
      isArchived?: boolean;
      maxItemsPerClient: number;
      expirationIntervalPerUse: string;
      maxUsage?: number;
    };
    response: {
      lastModifiedUtc: string;
      utmSource: string;
      utmCampaign?: string;
      couponCode: string;
      isArchived: boolean;
      maxItemsPerClient: number;
      expirationIntervalPerUse: string;
      maxUsage?: number;
    };
  };

  "GET /api/rnb/pvt/coupon/:couponCode": {
    params: {
      couponCode: string;
    };
    response: {
      lastModifiedUtc: string;
      utmSource: string;
      utmCampaign?: string;
      couponCode: string;
      isArchived: boolean;
      maxItemsPerClient: number;
      expirationIntervalPerUse: string;
      maxUsage?: number;
      groupingKey?: string;
    };
  };

  "GET /api/logistics/pvt/inventory/skus/:skuId": {
    params: {
      skuId: string;
    };
    response: {
      skuId: string;
      balance: Array<{
        warehouseId: string;
        warehouseName: string;
        totalQuantity: number;
        reservedQuantity: number;
        hasUnlimitedQuantity: boolean;
        timeToRefill: string | null;
        dateOfSupplyUtc: string | null;
        leadTime: string;
      }>;
    };
  };

  "GET /api/logistics/pvt/inventory/items/:skuId/warehouses/:warehouseId": {
    params: {
      skuId: string;
      warehouseId: string;
    };
    response: Array<{
      skuId: string;
      warehouseId: string;
      dockId: string;
      totalQuantity: number;
      reservedQuantity: number;
      availableQuantity: number;
      isUnlimited: boolean;
      salesChannel: string[];
      deliveryChannel: string[];
      timeToRefill: string | null;
      dateOfSupplyUtc: string | null;
      keepSellingAfterExpiration: boolean;
      transfer: string;
    }>;
  };

  "GET /api/logistics/pvt/configuration/warehouses": {
    response: Array<{
      id: string;
      name: string;
      warehouseDocks: Array<{
        dockId: string;
        time: string;
        cost: number;
      }>;
      pickupPointIds: string[];
      priority: number;
      isActive: boolean;
    }>;
  };
}
