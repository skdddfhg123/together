import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class UpdateFeedCommentDTO {

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'Content to be updated' })
    content?: string;

}