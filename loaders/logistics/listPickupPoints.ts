import type { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  accountName: string;
}

/**
 * @name list_pickup_points
 * @description List all pickup points
 */
export default async function loader(
  props: Props,
  _req: Request,
  _ctx: AppContext,
) {
  const vcs = getClient(props.accountName);

  const pickupPoints = await vcs
    ["GET /api/logistics/pvt/configuration/pickuppoints"]({})
    .then((r) => r.json());

  return pickupPoints;
}
