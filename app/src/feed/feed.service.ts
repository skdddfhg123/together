import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateFeedDTO } from './dtos/feed.create.dto';
import { PayloadResponse } from 'src/auth/dtos/payload-response';
import { Feed } from './entities/feed.entity';
import { GroupEventService } from 'src/db/event/group_event/groupEvent.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/db/user/user.service';
import { ReadFeedDTO } from './dtos/feed.read.dto';
import { ImageService } from 'src/image.upload/image.service';
import { FeedImage } from 'src/db/feedImage/entities/feedImage.entity';
import { UtilsService } from 'src/image.upload/aws.s3/utils/utils.service';
import { AwsService } from 'src/image.upload/aws.s3/aws.service';
import { FeedImageBinded } from './interface/feedAndImageBinding';


@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(Feed)
        private readonly feedRepository: Repository<Feed>,
        @InjectRepository(FeedImage)
        private readonly feedImageRepository: Repository<FeedImage>,
        private groupEventService: GroupEventService,
        private userService: UserService,
        private utilsService: UtilsService,
        private awsService: AwsService,
        private imageService: ImageService
    ) { }

    // async createFeed(  
    //     body: CreateFeedDTO,
    //     payload: PayloadResponse,
    //     groupEventId: string,
    //     images: Express.Multer.File[]
    // ) {
    //     try{
    //         const groupEvent = await this.groupEventService.findOne({ groupEventId: groupEventId });  
    //         if (!groupEvent) {
    //             throw new NotFoundException('Group event not found');
    //         }
    //         const user = await this.userService.findOne({useremail : payload.useremail})
    //         if (!user) {
    //             throw new UnauthorizedException('User not found');
    //         }
    //         /*
    //         해당 그룹의 소속이 아닐 때 exception
    //         */ 
    //         const feed = new Feed();
    //         feed.user = user;
    //         feed.groupEventId = groupEventId;
    //         feed.feedType = body.feedType;
    //         feed.title = body.title;
    //         feed.content = body.content;
    //         const savedFeed = await this.feedRepository.save(feed);

    //         if (images && images.length) {
    //         const imageUrls = await this.imageService.imageArrayUpload(images);

    //         for (const imageUrl of imageUrls) {
    //             const feedImage = new FeedImage();
    //             feedImage.feed = savedFeed;
    //             feedImage.imageSrc = imageUrl;
    //             await this.feedImageRepository.save(feedImage);
    //             }
    //         }

    //         console.log(feed);
    //     } catch (e) {
    //         console.error('Error saving feed:', e);
    //         throw new InternalServerErrorException('Error saving feed');
    //     }
    // }

    async createFeed(
        body: CreateFeedDTO,
        payload: PayloadResponse,
        groupEventId: string,
        images: Express.Multer.File[]
    ): Promise<{ feed: Feed, feedImages: FeedImage[] }> {
        try {
            const groupEvent = await this.groupEventService.findOne({ groupEventId: groupEventId });
            if (!groupEvent) {
                throw new NotFoundException('Group event not found');
            }
            const user = await this.userService.findOne({ useremail: payload.useremail })
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            const feed = new Feed();
            feed.user = user;
            feed.groupEventId = groupEventId;
            feed.feedType = body.feedType;
            feed.title = body.title;
            feed.content = body.content;
            await this.feedRepository.save(feed);

            let feedImages = []
            if (images && images.length) {
                const imageUrls = await this.imageService.imageArrayUpload(images);

                for (const imageUrl of imageUrls) {
                    const feedImage = new FeedImage();
                    const id = this.utilsService.extractFilename(imageUrl);
                    feedImage.feedImageId = id
                    feedImage.feed = feed;
                    feedImage.imageSrc = imageUrl;
                    const savedFeedImage = await this.feedImageRepository.save(feedImage);
                    delete feedImage.feed;
                    const { imageSrc, feedImageId } = feedImage
                    const resImage = { imageSrc, feedImageId }
                    feedImages.push(resImage);
                }
            }

            delete feed.user.useremail
            delete feed.user.password
            delete feed.user.prePwd
            delete feed.user.phone
            delete feed.user.registeredAt
            delete feed.user.updatedAt
            delete feed.user.deletedAt
            delete feed.user.birthDay
            delete feed.user.birthDayFlag

            console.log(feed);
            return { feed: feed, feedImages: feedImages }

        } catch (e) {
            console.error('Error saving feed:', e);
            throw new InternalServerErrorException('Error saving feed');
        }
    }


    async getAllFeedInGroupEvent(groupEventId: string): Promise<ReadFeedDTO[]> {
        try {
            const feeds = await this.feedRepository.createQueryBuilder('feed')
                .leftJoinAndSelect('feed.user', 'user')
                .leftJoinAndSelect('feed.feedImages', 'feedImage')
                .select([
                    'feed.feedType',
                    'feed.feedId',
                    'feed.title',
                    'feed.content',
                    'feed.createdAt',
                    'feed.updatedAt',
                    'user.nickname',
                    'user.thumbnail',
                    'feedImage.imageSrc'
                ])
                .where('feed.groupEventId = :groupEventId', { groupEventId })
                .andWhere('feed.deletedAt IS NULL')
                .orderBy('feed.createdAt', 'DESC')
                .getMany();

            return feeds.map(feed => {
                const dto = new ReadFeedDTO();
                dto.feedId = feed.feedId;
                dto.title = feed.title;
                dto.content = feed.content;
                dto.createdAt = feed.createdAt;
                dto.updatedAt = feed.updatedAt;
                dto.nickname = feed.user.nickname;
                dto.thumbnail = feed.user.thumbnail;
                dto.images = feed.feedImages;
                return dto;
            });
        } catch (e) {
            throw new InternalServerErrorException(`Failed to fetch group events for calendar ID ${groupEventId}: ${e.message}`);
        }
    }

    async getFeedDetail(feedId: string): Promise<ReadFeedDTO> {
        try {
            const feed = await this.feedRepository.createQueryBuilder('feed')
                .leftJoinAndSelect('feed.user', 'user')
                .leftJoinAndSelect('feed.feedImages', 'feedImage')
                .select([
                    'feed.feedType',
                    'feed.feedId',
                    'feed.title',
                    'feed.content',
                    'feed.createdAt',
                    'feed.updatedAt',
                    'user.nickname',
                    'user.thumbnail',
                    'feedImage.imageSrc',
                    'feedImage.feedImageId'
                ])
                .where('feed.feedId = :feedId', { feedId })
                .andWhere('feed.deletedAt IS NULL')
                .getOne();

            if (!feed) {
                throw new Error('Feed not found');
            }

            const feedDetailDTO = new ReadFeedDTO();
            feedDetailDTO.feedType = feed.feedType;
            feedDetailDTO.feedId = feed.feedId;
            feedDetailDTO.title = feed.title;
            feedDetailDTO.content = feed.content;
            feedDetailDTO.createdAt = feed.createdAt;
            feedDetailDTO.updatedAt = feed.updatedAt;
            feedDetailDTO.nickname = feed.user.nickname;
            feedDetailDTO.thumbnail = feed.user.thumbnail;
            feedDetailDTO.images = feed.feedImages;

            return feedDetailDTO;

        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to fetch feed details');
        }
    }

    async updateFeed(
        payload: PayloadResponse,
        feedId: string,
        updateData: Partial<Feed>,
        newImages?: Express.Multer.File[]
    ): Promise<{ feed: Feed, updatedFeedImages?: FeedImage[] }> {
        try {
            const feedToUpdate = await this.feedRepository.createQueryBuilder('feed')
                .innerJoinAndSelect('feed.user', 'user')
                .leftJoinAndSelect('feed.feedImages', 'feedImage')
                .where('feed.feedId = :feedId', { feedId })
                .andWhere('feed.deletedAt IS NULL')
                .getOne();

            if (!feedToUpdate) {
                throw new NotFoundException('Feed not found');
            }

            if (feedToUpdate.user?.useremail !== payload.useremail) {
                throw new ForbiddenException('Access denied');
            }

            const updatedFeed = this.feedRepository.merge(feedToUpdate, updateData);
            updatedFeed.updatedAt = new Date();

            let updatedFeedImages = [];
            if (newImages && newImages.length) {
                // 기존 이미지 삭제 또는 비활성화 처리
                feedToUpdate.feedImages.forEach(async image => {
                    image.deletedAt = new Date();
                    await this.feedImageRepository.save(image);
                });

                // 새 이미지를 S3에 업로드 및 저장
                const imageUrls = await this.imageService.imageArrayUpload(newImages);
                for (const imageUrl of imageUrls) {
                    const feedImage = new FeedImage();
                    feedImage.feed = updatedFeed;
                    feedImage.imageSrc = imageUrl;
                    const savedFeedImage = await this.feedImageRepository.save(feedImage);
                    updatedFeedImages.push({
                        imageSrc: savedFeedImage.imageSrc,
                        feedImageId: savedFeedImage.feedImageId
                    });
                }
            }

            await this.feedRepository.save(updatedFeed);
            return { feed: updatedFeed, updatedFeedImages };

        } catch (e) {
            console.error('Error occurred while updating the feed:', e);
            throw new InternalServerErrorException('Failed to modify feed');
        }
    }



    // async updateFeed(
    //     payload: PayloadResponse, 
    //     feedId: string, 
    //     updateData: Partial<Feed>,
    //     newImages?: Express.Multer.File[]
    // ): Promise<{ feed: Feed, updatedFeedImages?: FeedImage[] }> {
    //     try {
    //         const feedToUpdate = await this.feedRepository.createQueryBuilder('feed')
    //             .innerJoinAndSelect('feed.user', 'user')
    //             .leftJoinAndSelect('feed.feedImages', 'feedImage')
    //             .where('feed.feedId = :feedId', { feedId }) 
    //             .andWhere('feed.deletedAt IS NULL') 
    //             .getOne();

    //         if (!feedToUpdate) {
    //             throw new NotFoundException('Feed not found');
    //         }

    //         if (feedToUpdate.user?.useremail !== payload.useremail) {
    //             throw new ForbiddenException('Access denied'); 
    //         }

    //         const updatedFeed = this.feedRepository.merge(feedToUpdate, updateData);
    //         updatedFeed.updatedAt = new Date();  

    //         let updatedFeedImages = [];
    //         if (newImages && newImages.length) {
    //             // 기존 이미지 삭제 또는 비활성화 처리
    //             feedToUpdate.feedImages.forEach(async image => {
    //                 image.deletedAt = new Date();
    //                 await this.feedImageRepository.save(image);
    //             });

    //             // 새 이미지를 S3에 업로드 및 저장
    //         const imageUrls = await this.imageService.imageArrayUpload(newImages);
    //         for (const imageUrl of imageUrls) {
    //             const feedImage = new FeedImage();
    //             feedImage.feed = updatedFeed;
    //             feedImage.imageSrc = imageUrl;
    //             const savedFeedImage = await this.feedImageRepository.save(feedImage);
    //             updatedFeedImages.push({
    //                 imageSrc: savedFeedImage.imageSrc,
    //                 feedImageId: savedFeedImage.feedImageId
    //             });
    //         }
    //     }

    //         await this.feedRepository.save(updatedFeed);
    //         return { feed: updatedFeed, updatedFeedImages };

    //     } catch (e) {
    //         console.error('Error occurred while updating the feed:', e);
    //         throw new InternalServerErrorException('Failed to modify feed');
    //     }
    // }






    // async updateFeed(
    //     payload: PayloadResponse, 
    //     feedId: string, 
    //     updateData: Partial<Feed>
    // ): Promise<Feed> {
    //     try {
    //         const feedToUpdate = await this.feedRepository.createQueryBuilder('feed')
    //             .innerJoinAndSelect('feed.user', 'user')
    //             .where('feed.feedId = :feedId', { feedId }) 
    //             .andWhere('feed.deletedAt IS NULL') 
    //             .getOne();

    //         if (!feedToUpdate) {
    //             throw new NotFoundException('Feed not found');
    //         }

    //         if (feedToUpdate.user?.useremail !== payload.useremail) {
    //             throw new ForbiddenException('Access denied'); 
    //         }

    //         const updatedFeed = this.feedRepository.merge(feedToUpdate, updateData);
    //         updatedFeed.updatedAt = new Date();  
    //         return await this.feedRepository.save(updatedFeed);

    //     } catch (e) {
    //         console.error('Error occurred while updating the feed:', e);
    //         throw new InternalServerErrorException('Failed to modify feed');
    //     }
    // }






    async removeFeed(payload: PayloadResponse, feedId: string): Promise<Feed> {
        try {
            const feed = await this.feedRepository.findOne({
                where: { feedId: feedId },
                relations: ["user"]
            });

            if (!feed) {
                throw new NotFoundException('Feed not found');
            }

            if (feed.user?.useremail !== payload.useremail) {
                throw new ForbiddenException('Access denied');
            }

            if (feed.deletedAt != null) {
                throw new Error('Feed is already marked as deleted');
            }
            feed.deletedAt = new Date();

            const removedFeed = await this.feedRepository.save(feed);
            return removedFeed;

        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to mark feed as deleted');
        }
    }

    async findOne(data: Partial<Feed>): Promise<Feed> {
        const feed = await this.feedRepository.findOneBy({ feedId: data.feedId });
        if (!feed) {
            throw new UnauthorizedException('Could not find feed');
        }
        return feed;
    }


    async imageUpload(file: Express.Multer.File) {
        const imageName = this.utilsService.getUUID();
        const ext = file.originalname.split('.').pop();

        const imageUrl = await this.awsService.imageUploadToS3(
            `${imageName}.${ext}`,
            file,
            ext,
        );
        return imageUrl;
    }

    async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
        return Promise.all(files.map(file => this.imageUpload(file)));
    }
}
