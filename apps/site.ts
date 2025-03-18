import { type App, type AppContext as AC } from "@deco/deco";
import { createGraphqlClient } from "apps/utils/graphql.ts";
import { ClientOf, createHttpClient } from "apps/utils/http.ts";
import { removeDirtyCookies } from "apps/utils/normalize.ts";
import { VTEXCommerceStable } from "apps/vtex/utils/client.ts";
import { fetchSafe } from "apps/vtex/utils/fetchVTEX.ts";
import type { VCS } from "site/sdk/vcs.ts";
import type { Secret } from "apps/website/loaders/secret.ts";
import manifest, { Manifest } from "../manifest.gen.ts";

interface Props {
  account: string;
  appKey?: Secret;
  appToken?: Secret;
}

interface State extends Props {
  vcs: ClientOf<VCS>;
  io: ReturnType<typeof createGraphqlClient>;
  vcsDeprecated: ClientOf<VTEXCommerceStable>;
}

/**
 * @title Site
 * @description Start your site from a template or from scratch.
 * @category Tool
 * @logo https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1/0ac02239-61e6-4289-8a36-e78c0975bcc8
 */
export default function Site(props: Props): App<Manifest, State> {
  const headers = new Headers();

  if (props.appKey?.get()) {
    headers.set("X-VTEX-API-AppKey", props.appKey.get()!);
  }

  if (props.appToken?.get()) {
    headers.set("X-VTEX-API-AppToken", props.appToken.get()!);
  }

  console.log({
    appKey: props.appKey?.get(),
    appToken: props.appToken?.get(),
  });

  const account = props.account;

  const vcs = createHttpClient<VCS>({
    base: `https://${account}.vtexcommercestable.com.br`,
    fetcher: fetchSafe,
    processHeaders: removeDirtyCookies,
    headers: headers,
  });

  // // const sp = createHttpClient<SP>({
  // //   base: `https://sp.vtex.com`,
  // //   processHeaders: removeDirtyCookies,
  // //   fetcher: fetchSafe,
  // // });
  // // const my = createHttpClient<MY>({
  // //   base: `https://${account}.myvtex.com/`,
  // //   processHeaders: removeDirtyCookies,
  // //   fetcher: fetchSafe,
  // // });
  const vcsDeprecated = createHttpClient<VTEXCommerceStable>({
    base: `https://${account}.vtexcommercestable.com.br`,
    processHeaders: removeDirtyCookies,
    fetcher: fetchSafe,
  });
  const io = createGraphqlClient({
    endpoint:
      `https://${account}.vtexcommercestable.com.br/api/io/_v/private/graphql/v1`,
    processHeaders: removeDirtyCookies,
    fetcher: fetchSafe,
  });
  // const api = createHttpClient<API>({
  //   base: `https://api.vtex.com/${account}`,
  //   fetcher: fetchSafe,
  //   processHeaders: removeDirtyCookies,
  //   headers: headers,
  // });

  const state = {
    ...props,
    vcs,
    io,
    vcsDeprecated,
  };

  return {
    state,
    manifest,
    dependencies: [],
  };
}
export type SiteApp = ReturnType<typeof Site>;
export type AppContext = AC<SiteApp>;
