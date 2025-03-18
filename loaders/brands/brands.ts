import { AppContext } from "site/apps/site.ts";

interface Props {
  /**
   * @description Indicates whether to filter inactive brands
   */
  filterInactive?: boolean;
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
  const { filterInactive = false } = props;
  const { vcsDeprecated } = ctx;

  const brands = await vcsDeprecated["GET /api/catalog_system/pub/brand/list"](
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

  return brands;
};

export default loaders;

export const cache = "stale-while-revalidate";
export const cacheKey = (props: Props) =>
  props.filterInactive ? "brands-filtered" : "brands";
