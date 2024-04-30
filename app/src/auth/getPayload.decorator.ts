import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { PayloadResponse } from "./dtos/payload-response";

export const getPayload = createParamDecorator((data, ctx: ExecutionContext): PayloadResponse => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
})
