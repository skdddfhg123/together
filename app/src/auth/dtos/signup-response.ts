import { ApiProperty } from "@nestjs/swagger";

export class SignUpResponse {
    @ApiProperty()
    useremail: string;

    @ApiProperty()
    nickname: string;

    @ApiProperty()
    userCalendarId: string;
}