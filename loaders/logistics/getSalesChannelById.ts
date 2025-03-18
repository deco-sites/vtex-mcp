import type { AppContext } from "site/apps/site.ts";
import { SalesChannel } from "apps/vtex/utils/types.ts";

interface Props {
  id: string;
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
  const { vcs } = ctx;

  const salesChannel = await vcs
    ["GET /api/catalog_system/pub/saleschannel/:salesChannelId"]({
      salesChannelId: props.id,
    })
    .then((r) => r.json());

  return salesChannel;
}
