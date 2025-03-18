import { Category } from "apps/commerce/types.ts";
import { STALE } from "apps/utils/fetch.ts";
import { withSegmentCookie } from "apps/vtex/utils/segment.ts";
import { AppContext } from "site/apps/site.ts";
import { getSegmentFromBag } from "site/sdk/segment.ts";

export interface Props {
  /**
   * @title The number of category level that should be listed
   * @default 1
   */
  categoryLevels?: number;
}

/**
 * @name category_tree
 * @description Returns the category tree
 */
export default async function loader(
  { categoryLevels }: Props,
  _req: Request,
  ctx: AppContext,
): Promise<Category | Category[]> {
  return await ctx.vcsDeprecated
    ["GET /api/catalog_system/pub/category/tree/:level"]({
      level: categoryLevels ?? 1,
    }, { ...STALE, headers: withSegmentCookie(getSegmentFromBag(ctx)) })
    .then((res) => res.json());
}
