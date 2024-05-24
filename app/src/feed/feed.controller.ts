import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayloadResponse } from 'src/auth/dtos/payload-response';
import { getPayload } from 'src/auth/getPayload.decorator';
import { Feed } from './entities/feed.entity';
import { FeedService } from './feed.service';
import { CreateFeedDTO } from './dtos/feed.create.dto';
import { UpdateFeedDTO } from './dtos/feed.update.dto';
import { CreateFeedCommentDTO } from 'src/db/comment/dtos/comment.create.dto';
import { FeedComment } from 'src/db/comment/entities/comment.entity';
import { FeedCommentService } from 'src/db/comment/comment.service';
import { UpdateFeedCommentDTO } from 'src/db/comment/dtos/comment.update.dto';
import { ReadFeedDTO } from './dtos/feed.read.dto';
import { ReadFeedCommentDTO } from 'src/db/comment/dtos/comment.read.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FeedImageBinded } from './interface/feedAndImageBinding';
import { FeedImage } from 'src/db/feedImage/entities/feedImage.entity';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags("feed")
@Controller('feed')
export class FeedController {

    constructor(
        private feedService: FeedService,
        private feedCommentService: FeedCommentService
    ) { }

    @Post('create/:groupeventId')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 5 }
    ]))
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiOperation({ summary: 'group event 내에서 피드 생성' })
    @ApiResponse({ status: 201, description: 'Feed created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBearerAuth('JWT-auth')
    @ApiBody({ type: CreateFeedDTO })
    @UseGuards(JwtAuthGuard)
    async createFeed(

        @Body() createFeedDto: CreateFeedDTO,
        @getPayload() payload: PayloadResponse,
        @Param('groupeventId') groupEventId: string,
        @UploadedFiles() files: { images?: Express.Multer.File[] }

    ): Promise<{ feed: Feed, feedImages: FeedImage[] }> {
        return await this.feedService.createFeed(createFeedDto, payload, groupEventId, files.images);
    }

    @Get('get/calendar/:calendarId')
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiOperation({ summary: 'group calendar의 전체 피드 가져오기' })
    @ApiResponse({ status: 200, description: 'Get Feeds successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch feeds for group event ID' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getAllFeedInCalendar(

        @Param('calendarId') calendarId: string,

    ): Promise<ReadFeedDTO[]> {
        return await this.feedService.getAllFeedInCalendar(calendarId);
    }

    @Get('get/calendar/page/:calendarId')
    @ApiOperation({ summary: 'group event의 전체 피드 가져오기' })
    @ApiResponse({ status: 200, description: 'Get Feeds successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch feeds for group event ID' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getAllGroupEventPage(
        @Param('calendarId') calendarId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<ReadFeedDTO>> {
        limit = Math.min(100, limit); // 최대 100개 제한
        return this.feedService.getAllFeedInCalendarPage(calendarId, {
            page,
            limit,
        });
    }

    // //그룹 캘린더에서 피드 일괄 출력
    // @Get('get/calendar/:calendarId')
    // @ApiConsumes('multipart/form-data', 'application/json')
    // @ApiOperation({ summary: 'group calendar의 전체 피드 가져오기' })
    // @ApiResponse({ status: 200, description: 'Get Feeds successfully' })
    // @ApiResponse({ status: 500, description: 'Failed to fetch feeds for group event ID' })
    // @ApiBearerAuth('JWT-auth')
    // @UseGuards(JwtAuthGuard)
    // async getAllFeedInCalendar(

    //     @Param('calendarId') calendarId: string,

    // ): Promise<ReadFeedDTO[]> {
    //     return await this.feedService.getAllFeedInCalendar(calendarId);
    // }


    //그룹 이벤트에서 피드 일괄 출력
    @Get('get/groupevent/:groupeventId')
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiOperation({ summary: 'group event의 전체 피드 가져오기' })
    @ApiResponse({ status: 200, description: 'Get Feeds successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch feeds for group event ID' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getAllFeedInGroupEvent(

        @Param('groupeventId') groupEventId: string,

    ): Promise<ReadFeedDTO[]> {
        return await this.feedService.getAllFeedInGroupEvent(groupEventId);
    }

    @Get('get/groupevent/page/:groupeventId')
    @ApiOperation({ summary: 'group event의 전체 피드 가져오기' })
    @ApiResponse({ status: 200, description: 'Get Feeds successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch feeds for group event ID' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getAllFeedInGroupEventPage(
        @Param('groupeventId') groupeventId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<ReadFeedDTO>> {
        limit = Math.min(100, limit); // 최대 100개 제한
        return this.feedService.getAllFeedInGroupEventPage(groupeventId, {
            page,
            limit,
        });
    }


    // 특정 피드 보기, 피드 수정 form 
    @Get('get/detail/:feedId')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: '특정 피드 상세 보기, 피드 수정 시 form에 기존 데이터 받아오기' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getFeedDetail(

        @Param('feedId') feedId: string,

    ): Promise<ReadFeedDTO> {
        return await this.feedService.getFeedDetail(feedId);
    }

    // 피드 수정하기
    @Patch('update/:feedId')
    @ApiOperation({ summary: '피드 업데이트' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, description: 'Feed updated successfully' })
    @ApiResponse({ status: 403, description: 'You do not have permission to update this feed' })
    @ApiResponse({ status: 404, description: 'Feed not found' })
    @ApiResponse({ status: 500, description: 'Error updating feed' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor
        ([
            { name: 'images', maxCount: 5 }
        ]
        ))
    async updateFeed(

        @getPayload() payload: PayloadResponse,
        @Param('feedId') feedId: string,
        @Body() feedDTO: UpdateFeedDTO,
        @UploadedFiles() images: Express.Multer.File[]
    ): Promise<{ feed: Feed, updatedFeedImages?: FeedImage[] }> {
        return await this.feedService.updateFeed(payload, feedId, feedDTO, images);
    }




    // 피드 삭제하기 
    @Patch('remove/:feedId')
    @ApiOperation({ summary: '피드 삭제' })
    @ApiResponse({ status: 200, description: 'Feed removed successfully' })
    @ApiResponse({ status: 403, description: 'You do not have permission to remove this feed' })
    @ApiResponse({ status: 404, description: 'Feed not found' })
    @ApiResponse({ status: 500, description: 'Error removing feed' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async removeFeed(

        @getPayload() payload: PayloadResponse,
        @Param('feedId') feedId: string

    ): Promise<Feed> {
        return await this.feedService.removeFeed(payload, feedId);
    }


    // 특정 피드에 댓글 쓰기
    @Post('comment/create/:feedId')
    @ApiOperation({ summary: '피드 댓글 생성' })
    @ApiResponse({ status: 201, description: 'Feed created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBearerAuth('JWT-auth')
    @ApiBody({ type: CreateFeedCommentDTO })
    @UseGuards(JwtAuthGuard)
    async createFeedComment(

        @Body() createFeedDto: CreateFeedCommentDTO,
        @getPayload() payload: PayloadResponse,
        @Param('feedId') feedId: string

    ): Promise<FeedComment> {
        return await this.feedCommentService.createFeedComment(createFeedDto, payload, feedId);
    }


    // 특정 피드에서 댓글들 출력
    @Get('comment/:feedId')
    @ApiOperation({ summary: '특정 피드의 댓글들 가져오기' })
    @ApiResponse({ status: 200, description: 'Get Feeds successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch feeds for calendar ID' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getAllCommentsInFeed(

        @Param('feedId') feedId: string,

    ): Promise<ReadFeedCommentDTO[]> {
        return await this.feedCommentService.getAllCommentsInFeed(feedId);
    }


    // 특정 댓글 정보 가져오기
    @Get('comment/updateform/:feedcommentId')
    @ApiOperation({ summary: '특정 댓글 불러오기' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getFeedCommentForm(

        @Param('feedcommentId') feedCommentId: string,

    ): Promise<ReadFeedCommentDTO> {
        return await this.feedCommentService.getFeedCommentForm(feedCommentId);
    }


    // 특정 댓글 수정하기
    @Patch('comment/update/:feedcommentId')
    @ApiOperation({ summary: '피드 댓글 업데이트' })
    @ApiResponse({ status: 200, description: 'Feed comment updated successfully' })
    @ApiResponse({ status: 404, description: 'Feed comment not found' })
    @ApiResponse({ status: 500, description: 'Error comment updating feed' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async updateFeedComment(

        @getPayload() payload: PayloadResponse,
        @Param('feedcommentId') feedCommentId: string,
        @Body() updateFeedCommentDTO: UpdateFeedCommentDTO

    ): Promise<FeedComment> {
        return await this.feedCommentService.updateFeedComment(payload, feedCommentId, updateFeedCommentDTO);
    }

    // 특정 댓글 삭제하기
    @Patch('comment/remove/:feedcommentId')
    @ApiOperation({ summary: '피드댓글 삭제' })
    @ApiResponse({ status: 200, description: 'Feed comment removed successfully' })
    @ApiResponse({ status: 403, description: 'You do not have permission to remove this feed comment' })
    @ApiResponse({ status: 404, description: 'Feed comment not found' })
    @ApiResponse({ status: 500, description: 'Error removing feed comment' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async removeFeedComment(

        @getPayload() payload: PayloadResponse,
        @Param('feedcommentId') feedCommentId: string

    ): Promise<FeedComment> {
        return await this.feedCommentService.removeFeedComment(payload, feedCommentId);
    }


}
