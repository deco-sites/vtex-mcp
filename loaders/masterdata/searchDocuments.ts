import { resourceRange } from "apps/vtex/utils/resourceRange.ts";
import type { Document } from "apps/vtex/utils/types.ts";
import { parseCookie } from "apps/vtex/utils/vtexId.ts";
import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  /**
   * @description Two-letter string that identifies the data entity.
   */
  acronym: string;
  /**
   * @description Names of the fields that will be returned per document, separated by a comma ,. It is possible to fetch all fields using _all as the value of this query parameter. However, in order to avoid permission errors, we strongly recommend informing only the names of the exact fields that will be used.
   */
  fields?: string;
  /**
   * @description Specification of filters.
   */
  where?: string;
  /**
   * @description Inform a field name plus ASC to sort results by this field value in ascending order or DESC to sort by descending order.
   */
  sort?: string;
  /**
   * @description Number of documents to be returned.
   * @default 10
   * @maxValue 100
   * @minValue 1
   */
  take?: number;
  /**
   * @description Skip how many documents
   * @default 0
   * @maxValue 100
   * @minValue 0
   */
  skip?: number;
  /**
   * @description The account name
   */
  accountName: string;
}

/**
 * @name search_documents
 * @description Search for documents in a VTEX Data Entity
 * @docs https://developers.vtex.com/docs/api-reference/masterdata-api#get-/api/dataentities/-acronym-/search
 */
export default async function loader(
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<Document[]> {
  const vcs = getClient(props.accountName, ctx);
  const { acronym, fields, where, sort, skip = 0, take = 10 } = props;
  const { cookie } = parseCookie(req.headers, ctx.account);
  const limits = resourceRange(skip, take);

  const documents = await vcs["GET /api/dataentities/:acronym/search"]({
    acronym,
    _fields: fields,
    _where: where,
    _sort: sort,
  }, {
    headers: {
      accept: "application/vnd.vtex.ds.v10+json",
      "content-type": "application/json",
      cookie,
      "REST-Range": `resources=${limits.from}-${limits.to}`,
    },
  }).then((response) => response.json());

  return documents;
}
