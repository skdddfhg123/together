import { PickType } from "@nestjs/swagger";
import { Banner } from "../entities/banner.entity";

export class GetWebBannerDto extends PickType(Banner, [
    'webBannerUrl',
]) {}

export class GetAppBannerDto extends PickType(Banner, [
    'appBannerUrl',
    'alpha',
    'textColor'
]) {}