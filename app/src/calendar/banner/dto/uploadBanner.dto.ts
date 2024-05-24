import { PickType } from "@nestjs/swagger";
import { Banner } from "../entities/banner.entity";

export class UploadWebBannerDto extends PickType(Banner, [
    'webBannerUrl',
]) {}

export class UploadAppBannerDto extends PickType(Banner, [
    'appBannerUrl',
    'alpha',
    'textColor'
]) {}
