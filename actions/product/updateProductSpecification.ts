import { AppContext } from "site/apps/site.ts";
import { checkActionsEnabled } from "site/utils/actionGuard.ts";

export interface SpecificationData {
  SpecificationId: number;
  FieldValues: string[];
}

export interface Props {
  productId: string;
  specifications: SpecificationData[];
}

/**
 * @name update_product_specification
 * @description Updates specifications for a product in VTEX Catalog
 */
async function action(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  checkActionsEnabled(ctx, "update_product_specification");

  const { vcs } = ctx;
  const { productId, specifications } = props;

  // Validate specifications
  if (!specifications || specifications.length === 0) {
    throw new Error("No specifications provided");
  }

  try {
    const response = await vcs
      ["PUT /api/catalog/pvt/product/:productId/specification"]({
        productId,
      }, {
        body: specifications,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

    return {
      success: true,
      specifications: response,
    };
  } catch (error: unknown) {
    console.error("Error updating product specifications:", error);
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : "Failed to update product specifications",
    };
  }
}

export default action;
