import { AppContext } from "site/apps/site.ts";

export interface Props {
  clientEmail: string;
  page?: string;
  per_page?: string;
}

/**
 * @name list_user_orders
 * @description Get a list of orders for a user, searching by client email
 */
export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { vcs } = ctx;
  const { clientEmail, page = "0", per_page = "15" } = props;

  const ordersResponse = await vcs
    ["GET /api/oms/user/orders"](
      {
        clientEmail,
        page,
        per_page,
      },
    );

  const ordersList = await ordersResponse.json();

  return ordersList;
}
