import { WrappedSegment } from "apps/vtex/utils/segment.ts";
import { AppContext } from "site/apps/site.ts";

const SEGMENT = Symbol("segment");

export const getSegmentFromBag = (
  ctx: AppContext,
): WrappedSegment => ctx?.bag?.get(SEGMENT);
