import type { AppContext } from "site/apps/site.ts";
import { SalesChannel } from "apps/vtex/utils/types.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  id: string;
  accountName: string;
}

/**
 * @name get_sales_channel_by_id
 * @description Get a sales channel by its ID
 */
export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<SalesChannel> {
  const vcs = getClient(props.accountName, ctx);

  const salesChannel = await vcs
    ["GET /api/catalog_system/pub/saleschannel/:salesChannelId"]({
      salesChannelId: props.id,
    })
    .then((r) => r.json());

  return salesChannel;
}
