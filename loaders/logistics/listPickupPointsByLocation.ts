import type { PickupPoint } from "apps/vtex/utils/types.ts";
import type { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  /**
   * @description Geocoordinates (first longitude, then latitude) around which to search for pickup points. If you use this type of search, do not pass postal and country codes.
   */
  geoCoordinates?: number[];
  /**
   * @description Postal code around which to search for pickup points. If you use this type of search, make sure to pass a countryCode and do not pass geoCoordinates.
   */
  postalCode?: string;
  /**
   * @description Three letter country code referring to the postalCode field. Pass the country code only if you are searching pickup points by postal code.
   */
  countryCode?: string;
  /**
   * @description The account name
   */
  accountName: string;
}

/**
 * @name list_pickup_points_by_location
 * @description List pickup points by location, using geoCoordinates or postalCode and countryCode
 */
export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { geoCoordinates, postalCode, countryCode, accountName } = props;
  const vcs = getClient(accountName, ctx);

  const _props = geoCoordinates
    ? { geoCoordinates }
    : { postalCode, countryCode };

  const pickupPoints = await vcs
    ["GET /api/checkout/pub/pickup-points"](_props)
    .then((r) => r.json()) as {
      paging: { page: number; pageSize: number; total: number; pages: number };
      items: { distance: number; pickupPoint: PickupPoint }[];
    };

  return pickupPoints;
}
