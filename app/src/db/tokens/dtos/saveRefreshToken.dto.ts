import { PickType } from "@nestjs/swagger";
import { UserRefreshToken } from "../entities/userRefreshToken.entity";

export class SaveRefreshTokenDto extends PickType(UserRefreshToken, [
    'user'
]as const) {}