import { AppContext } from "site/apps/site.ts";

/**
 * Utility function to check if actions are disabled in the application.
 * If actions are disabled, this function will throw an error with a descriptive message.
 *
 * @param ctx The application context
 * @param actionName Optional name of the action for clearer error messages
 * @throws Error if actions are disabled
 */
export function checkActionsEnabled(
  ctx: AppContext,
  actionName?: string,
): void {
  if (ctx.disableActions) {
    throw new Error(
      `Action ${
        actionName ? `'${actionName}' ` : ""
      }cannot be executed: Actions are disabled in this environment.`,
    );
  }
}
