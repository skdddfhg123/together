import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateFeedCommentDTO {
   
    @ApiProperty({
        description: 'content of feed comment',
        example: '댓글 내용',
    })
    @IsString()
    content: string;


}
