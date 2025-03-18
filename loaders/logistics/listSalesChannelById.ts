import type { AppContext } from "site/apps/site.ts";
import { SalesChannel } from "apps/vtex/utils/types.ts";

/**
 * @name list_sales_channel_by_id
 * @description List all sales channels
 */
export default async function loader(
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): Promise<SalesChannel[]> {
  const { vcs } = ctx;

  const salesChannel = await vcs
    ["GET /api/catalog_system/pvt/saleschannel/list"]({})
    .then((r) => r.json());

  return salesChannel;
}
