import { Body, Controller, Get, InternalServerErrorException, Logger, NotFoundException, Param, Patch, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PayloadResponse } from "src/auth/dtos/payload-response";
import { getPayload } from "src/auth/getPayload.decorator";
import { CreateEmojiDTO } from "./dtos/emoji.create.dto";
import { Emoji } from "./entities/emoji.entity";
import { EmojiService } from "./emoji.service";
import { ReadEmojiDTO } from "./dtos/emoji.detail.dto";
import { ReadFeedDTO } from "src/feed/dtos/feed.read.dto";
import { EmojiInFeed } from "src/db/emoji_feed/entities/emoji.feed.entity";
import { JwtAuthGuard } from "src/auth/strategy/jwt.guard";



@ApiTags("emoji")
@Controller('emoji')
export class EmojiController {
    
    constructor(
       private emojiService: EmojiService,
    ) {}

   // 그룹 이모지 등록 
   @Post('create/:calendarId')
   @ApiBearerAuth('JWT-auth')               
   @ApiOperation({ summary: '이모지 업로드' }) 
   @ApiResponse({ status: 201, description: 'Feed created successfully' }) 
   @ApiResponse({ status: 403, description: 'Forbidden' })               
   //@ApiBody({ type: CreateEmojiDTO })       
   @ApiBody({
    schema: {
        type: 'object',
        properties: {
            emojiName: { type: 'string' },
            emojiFile: {
                type: 'string',
                format: 'binary',
                description: 'Emoji image file'
            }
        }
    }
})
   @ApiConsumes('multipart/form-data', 'application/json') 
   @UseGuards(JwtAuthGuard)                 
   @UseInterceptors(FileInterceptor('emojiFile')) 
   async createEmoji(
     @Param('calendarId') calendarId: string,
     @Body() createEmojiDTO: CreateEmojiDTO,
     @getPayload() payload: PayloadResponse,
     @UploadedFile() emojiFile: Express.Multer.File
   ): Promise<Emoji> { 
     return await this.emojiService.createEmoji(createEmojiDTO, payload, calendarId, emojiFile);
   }








    // 그룹 이모지 삭제
    @Patch('remove/:emojiId')
    @ApiOperation({ summary: '그룹 이모지 삭제' })
    @ApiResponse({ status: 200, description: 'emoji removed successfully' })
    @ApiResponse({ status: 403, description: 'You do not have permission to remove this emoji' })
    @ApiResponse({ status: 404, description: 'Emoji not found' })
    @ApiResponse({ status: 500, description: 'Error removing emoji' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async removeEmoji(

        @getPayload() payload: PayloadResponse,
        @Param('emojiId') emojiId: string
    
    ): Promise<Emoji> {
        return await this.emojiService.removeGroupEmoji(payload, emojiId);
    }


    // 그룹 이모지 1개 보기 (업로드, 피드, 댓글 공용)
    @Get('detail/:emojiId')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: '특정 이모지 상세 보기' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getEmojiDetail(

        @Param('emojiId') emojiId: string,

    ): Promise<ReadEmojiDTO>{
        return await this.emojiService.getEmojiDetail(emojiId);
    }


    // 그룹 이모지 목록 보기 
    @Get('get/:calendarId')
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiOperation({ summary: 'calendar에 등록된 그룹 이모지 목록 가져오기' })
    @ApiResponse({ status: 200, description: 'Get Emojis successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch emojis for group event ID' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getAllGroupEvent(

        @Param('calendarId') calendarId: string,

    ): Promise<ReadEmojiDTO[]>{
        return await this.emojiService.getAllEmojisInGroupCalendar(calendarId);
    }


    // 그룹 이모지 피드에 올리기
    @Post('attatch/:feedId/:emojiId')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: '그룹 멤버가 이모지를 피드에 첨부' })
    @ApiResponse({ status: 201, description: 'Emoji attatched successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async attatchEmojiInFeed(
      @getPayload() payload: PayloadResponse,
      @Param('feedId') feedId: string,
      @Param('emojiId') emojiId: string,
    ):Promise<EmojiInFeed>  { 
         return await this.emojiService.attatchEmojiInFeed(payload, feedId, emojiId);
    }


    // 그룹 이모지 피드에서 삭제하기
    @Patch('detach/:feedEmojiId')
    @ApiOperation({ summary: '피드의 이모지 삭제' })
    @ApiResponse({ status: 200, description: 'Feed removed successfully' })
    @ApiResponse({ status: 403, description: 'You do not have permission to remove this feed' })
    @ApiResponse({ status: 404, description: 'Feed not found' })
    @ApiResponse({ status: 500, description: 'Error removing feed' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async removeEmojiInFeed(

        @getPayload() payload: PayloadResponse,
        @Param('feedEmojiId') emojiInFeedId: string
    
    ): Promise<EmojiInFeed> {
        return await this.emojiService.removeEmojiInFeed(payload, emojiInFeedId);
    }



    // 특정 피드에 있는 그룹 이모지 보기
    @Get('get/infeed/:feedId')
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiOperation({ summary: 'feed에 등록된 이모지 목록 가져오기' })
    @ApiResponse({ status: 200, description: 'Get Emojis successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch emojis for group event ID' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getAllEmojisInFeed(

        @Param('feedId') feedId: string,

    ): Promise<ReadEmojiDTO[]>{
        return await this.emojiService.getAllEmojisInFeed(feedId);
    }







  /* ============================================ */

  // 그룹 이모지 댓글에 올리기

  // 그룹 이모지 댓글에서 삭제하기

  // 특정 댓글에 있는 그룹 이모지 보기












}
