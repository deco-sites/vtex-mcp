import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  /**
   * @description Indicates whether to filter inactive brands
   */
  filterInactive?: boolean;
  /**
   * @description The number of brands to return
   */
  count?: number;
  /**
   * @description The account name
   */
  accountName: string;
}

/**
 * @name brands
 * @description Returns a list of brands from the VTEX Catalog System
 */
const loaders = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const { filterInactive = false, count = 100, accountName } = props;
  const vcs = getClient(accountName, ctx);

  const brands = await vcs["GET /api/catalog_system/pub/brand/list"](
    {},
  )
    .then((r) => r.json())
    .catch(() => null);

  if (!brands) {
    return null;
  }

  if (filterInactive) {
    return brands.filter((brand) => brand.isActive);
  }

  return brands.slice(0, count);
};

export default loaders;

export const cache = "stale-while-revalidate";
export const cacheKey = (props: Props) => `brands_${props.accountName}`;
