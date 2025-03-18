import type { AppContext } from "site/apps/site.ts";

/**
 * @name list_pickup_points
 * @description List all pickup points
 */
export default async function loader(
  _props: unknown,
  _req: Request,
  ctx: AppContext,
) {
  const { vcs } = ctx;

  const pickupPoints = await vcs
    ["GET /api/logistics/pvt/configuration/pickuppoints"]({})
    .then((r) => r.json());

  return pickupPoints;
}
