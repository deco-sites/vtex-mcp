import type { AppContext } from "site/apps/site.ts";

interface Props {
  /**
   * @description You can retrieve orders lists filtering by an OrderField combined with an OrderType. To do so, you have to concatenate them: orderBy={{OrderField}},{{OrderType}}. OrderField values accepted: creationDate, orderId, items, totalValue and origin. OrderType values accepted: asc and desc.
   * @example v502556llux-01,asc
   */
  orderBy?: string;
  /**
   * @description Define the number of pages you wish to retrieve, restricted to the limit of 30 pages.
   * @maximum 30
   */
  page?: number;
  /**
   * @description Quantity of orders for each page, the default value is 15 and it goes up to 100 orders per page. Be aware that the limit of retrieval of this endpoint is 30 pages.
   * @maximum 100
   */
  per_page?: number;
  /**
   * @description Filters list to return only orders with non null values for the invoiceInput field.
   */
  f_hasInputInvoice?: boolean;
  /**
   * @description This parameter filters using Fulltext and accepts the values below. Be aware that the + caracter is not allowed in Fulltext Search. Order Id, Client email, Client document and Client name.
   * @example - OrderID: v212333lux-02 - Client email: taylor@email.com - Client document: 21133355524 - Client name: Taylor
   */
  q?: string;
  /**
   * @description You can filter orders by shipping estimate time in days by concatenating the desired number of days with the sufix .days. For example: Next 7 days: 7.days
   * @example Tomorrow: 1.days
   * @example Today: 0.days
   * @example Late: -1.days
   */
  f_shippingEstimate?: string;
  /**
   * @description You can filter orders by invoiced date by concatenating the sufix invoicedDate: with the range date in Timestamp format. For example:
   * @example 1 Day: invoicedDate:[2022-01-01T02:00:00.000Z TO 2022-01-02T01:59:59.999Z]
   * @example 1 Month: invoicedDate:[2022-01-01T02:00:00.000Z TO 2022-02-01T01:59:59.999Z]
   * @example 1 Year: invoicedDate:[2022-01-01T02:00:00.000Z TO 2022-01-01T01:59:59.999Z]
   * @example invoicedDate:[2022-01-01T02:00:00.000Z TO 2022-01-02T01:59:59.999Z]
   */
  f_invoicedDate?: string;
  /**
   * @description You can filter orders by creation date by concatenating the sufix creationDate: with the range date in Timestamp format. For example:
   * @example 1 Day: creationDate:[2022-01-01T02:00:00.000Z TO 2022-01-02T01:59:59.999Z]
   * @example 1 Month: creationDate:[2022-01-01T02:00:00.000Z TO 2022-02-01T01:59:59.999Z]
   * @example 1 Year: creationDate:[2022-01-01T02:00:00.000Z TO 2022-01-01T01:59:59.999Z]
   * @example creationDate:[2022-01-01T02:00:00.000Z TO 2022-01-02T01:59:59.999Z]
   */
  f_creationDate?: string;
  /**
   * @description You can filter orders by authorized date by concatenating the sufix authorizedDate: with the range date in Timestamp format. For example:
   * @example 1 Day: authorizedDate:[2022-01-01T02:00:00.000Z TO 2022-01-02T01:59:59.999Z]
   * @example 1 Month: authorizedDate:[2022-01-01T02:00:00.000Z TO 2022-02-01T01:59:59.999Z]
   * @example 1 Year: authorizedDate:[2022-01-01T02:00:00.000Z TO 2022-01-01T01:59:59.999Z]
   * @example authorizedDate:[2022-01-01T02:00:00.000Z TO 2022-01-02T01:59:59.999Z]
   */
  f_authorizedDate?: string;
  /**
   * @description You can filter orders by Urchin Tracking Module (UTM) source.
   * @example christmas_campaign
   */
  f_UtmSource?: string;
  /**
   * @description You can filter orders by using a seller's name.
   * @example SellerName
   */
  f_sellerNames?: string;
  /**
   * @description You can filter orders by using a Call Center Operator's identification.
   * @example Operator%20Name
   */
  f_callCenterOperatorName?: string;
  /**
   * @description You can filter orders by sales channel's (or trade policy) name.
   * @example Main
   */
  f_salesChannel?: string;
  /**
   * @description You can filter orders by sales channel's (or trade policy) ID.
   * @example 1
   */
  salesChannelId?: string;
  /**
   * @description You can filter orders by affiliate ID.
   * @example WLM
   */
  f_affiliateId?: string;
  /**
   * @description You can filter orders by the following order status:
   * @example waiting-for-sellers-confirmation
   * @example payment-pending
   * @example payment-approved
   * @example ready-for-handling
   * @example handling
   * @example invoiced
   * @example canceled
   * @example ready-for-handling
   */
  f_status?: string;
  /**
   * @description When set as true, you retrieve incomplete orders, when set as false, you retrieve orders that are not incomplete.
   * @example true
   */
  incompleteOrders?: boolean;
  /**
   * @description You can filter orders by payment type.
   * @example Visa
   */
  f_paymentNames?: string;
  /**
   * @description You can filter orders by rates and benefits (promotions).
   * @example Free+Shipping
   */
  f_RnB?: string;
  /**
   * @description You can search orders by using one of the following criterias:
   * @example - SKU ID: `25`
   * @example - Gift List ID: `11223`
   * @example - Transaction ID (TID): `54546300238810034995829230012`
   * @example - PCI Connector's Transaction ID (TID): `7032909234899834298423209`
   * @example - Payment ID (PID): `2`
   * @example - Connector's NSU: `2437281`
   */
  searchField?: string;
  /**
   * @description When set as true, this parameter filters orders made via inStore, and when set as false, it filters orders that were not made via inStore.
   * @example true
   */
  f_isInstore?: boolean;
}

/**
 * @name list_orders
 * @description List orders
 */
export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { vcs } = ctx;

  const orders = await vcs["GET /api/oms/pvt/orders"](props)
    .then((res) => res.json());

  return orders;
}
