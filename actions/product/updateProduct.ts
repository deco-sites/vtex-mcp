import { AppContext } from "site/apps/site.ts";
import { checkActionsEnabled } from "site/utils/actionGuard.ts";

export interface ProductData {
  Name: string;
  CategoryPath: string;
  BrandId: number;
  CategoryId: number;
  LinkId?: string;
  RefId?: string;
  IsVisible?: boolean;
  Description?: string;
  DescriptionShort?: string;
  ReleaseDate?: string;
  KeyWords?: string;
  Title?: string;
  IsActive?: boolean;
  TaxCode?: string;
  MetaTagDescription?: string;
  SupplierId?: number;
  ShowWithoutStock?: boolean;
  AdWordsRemarketingCode?: string;
  LomadeeCampaignCode?: string;
  Score?: number;
}

export interface Props {
  productId: string;
  product: ProductData;
}

/**
 * @name update_product
 * @description Updates a product in VTEX Catalog
 */
async function action(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  checkActionsEnabled(ctx, "update_product");

  const { vcs } = ctx;
  const { productId, product } = props;

  // Validate required fields
  if (!product.Name || !product.CategoryPath || !product.BrandId) {
    throw new Error("Missing required fields: Name, CategoryPath, or BrandId");
  }

  try {
    const response = await vcs["PUT /api/catalog/pvt/product/:productId"]({
      productId,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
      body: product,
    });

    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    return error instanceof Error ? error.message : "Failed to update product";
  }
}

export default action;
