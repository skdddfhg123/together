import { PickType } from "@nestjs/swagger";
import { UserAccessToken } from "../entities/userAccessToken.entity";

export class SaveAccessTokenDto extends PickType(UserAccessToken, [
    'user'
]as const) {}