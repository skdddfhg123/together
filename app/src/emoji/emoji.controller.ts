import { Body, Controller, Param, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PayloadResponse } from "src/auth/dtos/payload-response";
import { getPayload } from "src/auth/getPayload.decorator";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { CreateEmojiDTO } from "./dtos/emoji.create.dto";
import { Emoji } from "./entities/emoji.entity";
import { EmojiService } from "./emoji.service";



@ApiTags("emoji")
@Controller('emoji')
export class EmojiController {
    
    constructor(
       private emojiService: EmojiService
    ) {}

   // 그룹 이모지 등록 
    @Post('create/:calendarId')
    @UseInterceptors(FileInterceptor('emojiFile'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: '이모지 업로드' })
    @ApiResponse({ status: 201, description: 'Feed created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBearerAuth('JWT-auth')
    @ApiBody({ type: CreateEmojiDTO })
    @UseGuards(JwtAuthGuard)
    async createEmoji(

      @Body() createEmojiDTO: CreateEmojiDTO,
      @getPayload() payload: PayloadResponse,
      @Param('calendarId') calendarId: string,
      @UploadedFile() file: Express.Multer.File

    ):Promise<Emoji>  { 
         return await this.emojiService.createEmoji(createEmojiDTO, payload, calendarId, file);
    }

    // 그룹 이모지 삭제



    // 그룹 이모지 1개 보기



    // 그룹 이모지 목록 보기 



    // 그룹 이모지 피드에 올리기



    // 그룹 이모지 피드에서 삭제하기




    // 특정 피드에 있는 그룹 이모지 보기








/* ============================================ */

    // 그룹 이모지 댓글에 올리기

    // 그룹 이모지 댓글에서 삭제하기

    // 특정 댓글에 있는 그룹 이모지 보기












}
