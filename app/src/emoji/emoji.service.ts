import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateEmojiDTO } from "./dtos/emoji.create.dto";
import { PayloadResponse } from "src/auth/dtos/payload-response";
import { UserService } from "src/db/user/user.service";
import { Calendar } from "src/calendar/entities/calendar.entity";
import { Repository } from "typeorm";
import { Emoji } from "./entities/emoji.entity";
import { ImageService } from "src/image.upload/image.service";
import { ReadEmojiDTO } from "./dtos/emoji.detail.dto";
import { EmojiInFeed } from "src/db/emoji_feed/entities/emoji.feed.entity";
import { Feed } from "src/feed/entities/feed.entity";
import { UtilsService } from "src/utils/utils.service";


@Injectable()
export class EmojiService {
    constructor(
        @InjectRepository(Calendar)
        private readonly calendarRepository: Repository<Calendar>,
        @InjectRepository(Emoji)
        private readonly emojiRepository: Repository<Emoji>,
        @InjectRepository(Feed)
        private readonly feedRepository: Repository<Feed>,
        @InjectRepository(EmojiInFeed)
        private readonly emojiInFeedRepository: Repository<EmojiInFeed>,
        private userService: UserService,
        private imageService: ImageService,
        private utilService: UtilsService,
    ) { }

    async createEmoji(
        body: CreateEmojiDTO,
        payload: PayloadResponse,
        calendarId: string,
        emojiFile: Express.Multer.File
    ): Promise<Emoji> {
        try {
            // 이모지가 저장된 그룹 캘린더 특정 
            const calendar = await this.calendarRepository.findOneBy({ calendarId: calendarId });
            if (!calendar) {
                throw new NotFoundException('Calendar not found');
            }
            // 이모지를 저장할 유저 불러오기
            const user = await this.userService.findOne({ useremail: payload.useremail })
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            if (!calendar.attendees.includes(payload.userCalendarId)) {
                throw new ForbiddenException('You do not have permission to add an event to this calendar');
            }

            const emoji = new Emoji();
            // emoji.user = user;
            emoji.emojiId = this.utilService.getUUID();
            emoji.calendar = calendar;
            emoji.emojiName = body.emojiName;
            const imageUrl = await this.imageService.emojiImageUpload(emojiFile, emoji.emojiId);
            emoji.emojiUrl = imageUrl

            return await this.emojiRepository.save(emoji);

        } catch (e) {
            console.error('Error saving emoji:', e);
            throw new InternalServerErrorException('Error saving emoji');
        }
    }


    async removeGroupEmoji(payload: PayloadResponse, emojiId: string): Promise<Emoji> {
        try {
            const emoji = await this.emojiRepository.findOne({
                where: { emojiId: emojiId },
                relations: ["user"]
            });

            if (!emoji) {
                throw new NotFoundException('Emoji not found');
            }

            // if (emoji.user?.useremail !== payload.useremail) {
            //     throw new ForbiddenException('Access denied');
            // }

            if (emoji.deletedAt != null) {
                throw new Error('Emoji is already marked as deleted');
            }
            emoji.deletedAt = new Date();

            const removedEmoji = await this.emojiRepository.save(emoji);
            return removedEmoji;

        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to mark emoji as deleted');
        }
    }


    async getEmojiDetail(emojiId: string): Promise<ReadEmojiDTO> {
        try {
            const emoji = await this.emojiRepository.createQueryBuilder('emoji')
                .select([
                    'emoji.emojiId',
                    'emoji.emojiUrl',
                    'emoji.emojiName',
                    'emoji.createdAt',
                ])
                .where('emoji.emojiId = :emojiId', { emojiId })
                .andWhere('emoji.deletedAt IS NULL')
                .getOne();

            if (!emoji) {
                throw new Error('Feed not found');
            }

            const emojiDetailDTO = new ReadEmojiDTO();
            emojiDetailDTO.emojiId = emoji.emojiId;
            emojiDetailDTO.emojiUrl = emoji.emojiUrl;
            emojiDetailDTO.emojiName = emoji.emojiName;
            emojiDetailDTO.createdAt = emoji.createdAt;
            // emojiDetailDTO.nickname = emoji.user.nickname;       

            return emojiDetailDTO;

        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to fetch emoji details');
        }
    }

    async getAllEmojisInGroupCalendar(calendarId: string): Promise<ReadEmojiDTO[]> {
        try {
            const emojis = await this.emojiRepository.createQueryBuilder('emoji')
                //.leftJoinAndSelect('emoji.user', 'user')
                .select([
                    'emoji.emojiId',
                    'emoji.emojiUrl',
                    'emoji.emojiName',
                    'emoji.createdAt',
                    //'user.nickname',
                ])
                .where('emoji.calendarId = :calendarId', { calendarId })
                .andWhere('emoji.deletedAt IS NULL')
                .orderBy('emoji.createdAt', 'DESC')
                .getMany();

            return emojis.map(emoji => {
                const dto = new ReadEmojiDTO();
                dto.emojiId = emoji.emojiId;
                dto.emojiUrl = emoji.emojiUrl;
                dto.emojiName = emoji.emojiName;
                dto.createdAt = emoji.createdAt;
                // dto.nickname = emoji.user.nickname;
                return dto;
            });
        } catch (e) {
            throw new InternalServerErrorException(`Failed to fetch group events for calendar ID ${calendarId}: ${e.message}`);
        }
    }



    async attatchEmojiInFeed(
        payload: PayloadResponse,
        feedId: string,
        emojiId: string
    ): Promise<EmojiInFeed> {
        try {

            const feed = await this.feedRepository.findOneBy({ feedId: feedId });
            if (!feed) {
                throw new NotFoundException('Feed not found');
            }

            const user = await this.userService.findOne({ useremail: payload.useremail })
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            // if (!calendar.attendees.includes(payload.userCalendarId)) {
            //     throw new ForbiddenException('You do not have permission to add an event to this calendar');
            // }

            const emoji = await this.findOne({ emojiId: emojiId });
            if (!emoji) {
                throw new NotFoundException('Emoji not found');
            }


            const emojiInFeed = new EmojiInFeed();
            emojiInFeed.user = user;
            emojiInFeed.feed = feed;
            emojiInFeed.emoji = emoji;
            //const imageUrl = await this.imageService.imageUpload(emojiFile);

            return await this.emojiInFeedRepository.save(emojiInFeed);

        } catch (e) {
            console.error('Error saving emoji:', e);
            throw new InternalServerErrorException('Error saving emoji');
        }
    }


    async removeEmojiInFeed(
        payload: PayloadResponse,
        emojiInFeedId: string
    ): Promise<EmojiInFeed> {
        try {
            const emojiInFeed = await this.emojiInFeedRepository.findOne({
                where: { emojiInFeedId: emojiInFeedId },
                relations: ["user"]
            });

            if (!emojiInFeed) {
                throw new NotFoundException('Feed not found');
            }

            if (emojiInFeed.user?.useremail !== payload.useremail) {
                throw new ForbiddenException('Access denied');
            }

            if (emojiInFeed.deletedAt != null) {
                throw new Error('Feed is already marked as deleted');
            }
            emojiInFeed.deletedAt = new Date();

            const removedEmojiInFeed = await this.emojiInFeedRepository.save(emojiInFeed);
            return removedEmojiInFeed;

        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to mark emoji as deleted');
        }
    }


    async getAllEmojisInFeed(feedId: string): Promise<ReadEmojiDTO[]> {
        try {
            const emojis = await this.emojiInFeedRepository.createQueryBuilder('emoji_feed')
                .leftJoinAndSelect('emoji_feed.user', 'user')
                .leftJoinAndSelect('emoji_feed.emoji', 'emoji')
                .select([
                    'emoji_feed.emojiInFeedId',
                    'emoji.emojiUrl',
                    'emoji.emojiName',
                    'emoji_feed.createdAt',
                    'user.nickname',
                ])
                .where('emoji_feed.feedId = :feedId', { feedId })
                .andWhere('emoji_feed.deletedAt IS NULL')
                .orderBy('emoji_feed.createdAt', 'DESC')
                .getMany();

            return emojis.map(emojiInFeed => {
                const dto = new ReadEmojiDTO();
                dto.emojiId = emojiInFeed.emojiInFeedId
                dto.emojiUrl = emojiInFeed.emoji.emojiUrl
                dto.emojiName = emojiInFeed.emoji.emojiName
                dto.createdAt = emojiInFeed.createdAt
                dto.nickname = emojiInFeed.user.nickname;
                return dto;
            });
        } catch (e) {
            throw new InternalServerErrorException(`Failed to fetch group events for feed ID ${feedId}: ${e.message}`);
        }
    }


    async findOne(data: Partial<Emoji>): Promise<Emoji> {
        const emoji = await this.emojiRepository.findOneBy({ emojiId: data.emojiId });
        if (!emoji) {
            throw new UnauthorizedException('Could not find user');
        }
        return emoji;
    }

}