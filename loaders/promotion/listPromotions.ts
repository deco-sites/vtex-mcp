import { STALE } from "apps/utils/fetch.ts";
import { AppContext } from "site/apps/site.ts";

export interface Props {
  /**
   * @description Filter by type of promotion (e.g., "regular", "progressive")
   */
  type?: string;

  /**
   * @description Filter to show only active promotions
   */
  activeOnly?: boolean;
}

/**
 * @name list_promotions
 * @description Retrieves all active promotions and discounts from the store
 */
async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { vcs } = ctx;
  const { type, activeOnly } = props;

  try {
    const response = await vcs
      ["GET /api/rnb/pvt/benefits/calculatorconfiguration"](
        {},
        { ...STALE },
      ).then((res) => res.json());

    // Filter the results if necessary
    let filteredItems = response.items;

    if (activeOnly) {
      filteredItems = filteredItems.filter((promotion) => promotion.isActive);
    }

    if (type) {
      filteredItems = filteredItems.filter((promotion) =>
        promotion.type === type
      );
    }

    return {
      ...response,
      items: filteredItems,
    };
  } catch (error: unknown) {
    console.error("Error fetching promotions:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch promotions from VTEX",
    );
  }
}

export const cache = "stale-while-revalidate";

export const cacheKey = (props: Props, req: Request) => {
  const url = new URL(req.url);
  const params = new URLSearchParams();

  if (props.type) {
    params.append("type", props.type);
  }

  if (props.activeOnly !== undefined) {
    params.append("activeOnly", props.activeOnly.toString());
  }

  params.sort();
  url.search = params.toString();

  return url.href;
};

export default loader;
