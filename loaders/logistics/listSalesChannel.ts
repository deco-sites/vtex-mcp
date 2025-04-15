import { SalesChannel } from "apps/vtex/utils/types.ts";
import type { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  /**
   * @description The account name
   */
  accountName: string;
}

/**
 * @name list_sales_channel
 * @description List all sales channels
 */
export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<SalesChannel[]> {
  const vcs = getClient(props.accountName, ctx);

  const salesChannel = await vcs
    ["GET /api/catalog_system/pvt/saleschannel/list"]({})
    .then((r) => r.json());

  return salesChannel;
}
