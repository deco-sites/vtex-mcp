import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

export interface Props {
  term?: string;
  accountName: string;
}

/**
 * @name collection_list
 * @description Returns the collection list
 */
export default async function loader(
  { term, accountName }: Props,
  _req: Request,
  ctx: AppContext,
) {
  const vcs = getClient(accountName, ctx);

  const collectionResponse = term
    ? await vcs["GET /api/catalog_system/pvt/collection/search/:searchTerms"]({
      searchTerms: term,
      page: 1,
      pageSize: 15,
    })
    : await vcs["GET /api/catalog_system/pvt/collection/search"]({
      page: 1,
      pageSize: 3000,
      orderByAsc: false,
    });
  const collectionList = await collectionResponse.json();

  return collectionList;
}
