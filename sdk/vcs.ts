import { OpenAPI } from "apps/vtex/utils/openapi/vcs.openapi.gen.ts";

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
}
