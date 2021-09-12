import { Router } from "express";
import BillsController from "./bills.controller";
import { UnauthorisedRouteHandlerBuilder } from "../utils/route-utils";
import { IServices } from "../../services";
import { IBillsCallbackPayload } from "./types.ts/requests";

const billsController = (c: config.IConfig, s: IServices): BillsController =>
  new BillsController(c, s);

const billsRouter = Router();

export const routes = (
  unauthRequest: UnauthorisedRouteHandlerBuilder
): Router => {
  billsRouter.post(
    "/",
    unauthRequest<void, IBillsCallbackPayload, void, string, BillsController>(
      billsController,
      (c: BillsController) => c.handleBillsWebhookSubscription
    )
  );
  return billsRouter;
};
