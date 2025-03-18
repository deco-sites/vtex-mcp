import { AppContext } from "site/apps/site.ts";
import type { Document } from "apps/vtex/utils/types.ts";
import { parseCookie } from "apps/vtex/utils/vtexId.ts";

interface Props {
  /**
   * @description Promotion ID.
   */
  idCalculatorConfiguration: string;
}

/**
 * @name get_promotion_by_id
 * @description Get a promotion by ID
 */
export default async function loader(
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<Document[]> {
  const { vcs } = ctx;
  const { idCalculatorConfiguration } = props;
  const { cookie } = parseCookie(req.headers, ctx.account);

  const promotionById = await vcs
    ["GET /api/rnb/pvt/calculatorconfiguration/:idCalculatorConfiguration"]({
      idCalculatorConfiguration,
    }, {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        cookie,
      },
    }).then((response: Response) => response.json());

  return promotionById;
}
