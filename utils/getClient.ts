import { type ClientOf, createHttpClient } from "apps/utils/http.ts";
import { removeDirtyCookies } from "apps/utils/normalize.ts";
import { fetchSafe } from "apps/vtex/utils/fetchVTEX.ts";
import type { VTEXCommerceStable } from "apps/vtex/utils/client.ts";
import type { VCS } from "site/sdk/vcs.ts";

const clients = new Map<string, ClientOf<VCS & VTEXCommerceStable>>();

export default function getClient(
  account: string,
): ClientOf<VCS & VTEXCommerceStable> {
  if (clients.has(account)) {
    return clients.get(account)!;
  }

  const client = createHttpClient<VCS & VTEXCommerceStable>({
    base: `https://${account}.vtexcommercestable.com.br`,
    fetcher: fetchSafe,
    processHeaders: removeDirtyCookies,
  });

  clients.set(account, client);

  return client;
}
