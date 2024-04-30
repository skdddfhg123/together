import { ApiProperty } from "@nestjs/swagger";

export class PayloadResponse {
    @ApiProperty()
    useremail: string;

    @ApiProperty()
    nickname: string;

    @ApiProperty()
    userCalendarId: string;
}