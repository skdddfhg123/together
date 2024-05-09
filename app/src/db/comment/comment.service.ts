import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FeedComment } from "./entities/comment.entity";
import { Repository } from "typeorm";
import { CreateFeedCommentDTO } from "./dtos/comment.create.dto";
import { PayloadResponse } from "src/auth/dtos/payload-response";
import { FeedService } from "src/feed/feed.service";
import { UserService } from "../user/user.service";
import { ReadFeedCommentDTO } from "./dtos/comment.read.dto";

@Injectable()
export class FeedCommentService {
    constructor (
        @InjectRepository(FeedComment)
        private readonly feedCommentRepository: Repository<FeedComment>,
        private feedService: FeedService,
        private userService: UserService
    ) {}

    async createFeedComment(
        body: CreateFeedCommentDTO,
        payload: PayloadResponse,
        feedId: string
    ): Promise<FeedComment> {
        try {
            const feed = await this.feedService.findOne({ feedId: feedId });  
            if (!feed) {
                throw new NotFoundException('Feed not found');
            }
            /*
            해당 그룹의 소속이 아닐 때 exception
            */ 
            const user = await this.userService.findOne({useremail : payload.useremail})
            const feedComment = new FeedComment();
            feedComment.user = user
            feedComment.feedId = feed

            const content = body.content
            feedComment.content = content;

            
            const savedFeedComment = await this.feedCommentRepository.save(feedComment);
            //delete feedComment.user;
            delete feedComment.user.useremail
            delete feedComment.user.password
            delete feedComment.user.prePwd
            delete feedComment.user.phone
            delete feedComment.user.registeredAt
            delete feedComment.user.updatedAt
            delete feedComment.user.deletedAt
            delete feedComment.user.birthDay
            delete feedComment.user.birthDayFlag
            delete feedComment.feedId;
            
            return savedFeedComment;
        } catch (e) {
            console.error('Error saving feed comment:', e);
            throw new InternalServerErrorException('Error saving feed comment');
        }
    }

    /*
    async createNestedFeedComment
    */
    
    async getAllCommentsInFeed(feedId: string): Promise<ReadFeedCommentDTO[]> {
        try {
            const feedComments = await this.feedCommentRepository.createQueryBuilder('feedComment')
                .leftJoinAndSelect('feedComment.user', 'user')
                .select([
                    'feedComment.feedCommentId',
                    'feedComment.content',
                    'feedComment.createdAt',
                    'feedComment.updatedAt',
                    'user.nickname', 
                    'user.thumbnail'
                ])
                .where('feedComment.feedId = :feedId', { feedId })
                .andWhere('feedComment.deletedAt IS NULL')
                .orderBy('feedComment.createdAt', 'ASC')
                .getMany();

            return feedComments.map(feedComment => {
                const dto = new ReadFeedCommentDTO();
                dto.feedCommentId = feedComment.feedCommentId;
                dto.content = feedComment.content;
                dto.createdAt = feedComment.createdAt;
                dto.updatedAt = feedComment.updatedAt;
                dto.nickname = feedComment.user.nickname;
                dto.thumbnail = feedComment.user.thumbnail;
                return dto;
            });
        } 
        catch (e) {
          throw new InternalServerErrorException(`Failed to fetch group events for calendar ID ${feedId}`);
        }
    }

    async getFeedCommentForm( feedCommentId : string ): Promise<ReadFeedCommentDTO> {
        try {
            const feedComment = await this.feedCommentRepository.createQueryBuilder('feedComment')
            .leftJoinAndSelect('feedComment.user', 'user')
            .select([
                'feedComment.feedCommentId',
                'feedComment.content',
                'feedComment.createdAt',
                'feedComment.updatedAt',
                'user.nickname', 
                'user.thumbnail'
            ])
            .where('feedComment.feedCommentId = :feedCommentId', { feedCommentId })
            .andWhere('feedComment.deletedAt IS NULL')
            .orderBy('feedComment.createdAt', 'DESC')
            .getOne();

            if (!feedComment) {
                throw new Error('feedComment not found');
                }
                const dto = new ReadFeedCommentDTO();
                dto.feedCommentId = feedComment.feedCommentId;
                dto.content = feedComment.content;
                dto.createdAt = feedComment.createdAt;
                dto.updatedAt = feedComment.updatedAt;
                dto.nickname = feedComment.user.nickname;
                dto.thumbnail = feedComment.user.thumbnail;
                return dto;

            } catch (e) {
                console.error('Error occurred:', e);
                throw new InternalServerErrorException('Failed to deactivate feed comment');
            }
        }
 
    async updateFeedComment(
        payload: PayloadResponse, 
        feedCommentId: string, 
        updateData: Partial<FeedComment>
    ): Promise<FeedComment> {
        try {
            const feedCommentToUpdate = await this.feedCommentRepository.createQueryBuilder('feedComment')
                .innerJoinAndSelect('feedComment.user', 'user')
                .innerJoinAndSelect('feedComment.feedId', 'feed')
                .where('feedComment.feedCommentId = :feedCommentId', { feedCommentId })
                .andWhere('feedComment.deletedAt IS NULL')
                .getOne();

            if (!feedCommentToUpdate) {
                throw new NotFoundException('FeedComment not found');
            }
    
            if (feedCommentToUpdate.user?.useremail !== payload.useremail) {
                throw new ForbiddenException('Access denied'); 
            }

            const updatedFeedComment = this.feedCommentRepository.merge(feedCommentToUpdate, updateData);
            updatedFeedComment.updatedAt = new Date(); 
            const updateResult = await this.feedCommentRepository.save(updatedFeedComment);
            delete updateResult.user
            delete updateResult.feedId
            delete updateResult.isDeleted
            delete updateResult.deletedAt
            delete updateResult.createdAt

            return updateResult

        } catch (e) {
            console.error('Error occurred while updating the feedComment:', e);
            throw new InternalServerErrorException('Failed to modify feedComment');
        }
    }
    
    async removeFeedComment(
        payload: PayloadResponse, 
        feedCommentId: string
    ): Promise<FeedComment> {
        try {
            const feedComment = await this.feedCommentRepository.findOne({
                where: { feedCommentId : feedCommentId },
                relations: ["user"]
            });
    
            if (!feedComment) {
                throw new NotFoundException('FeedComment not found');
            }
    
            if (feedComment.user?.useremail !== payload.useremail) {
                throw new ForbiddenException('Access denied');
            }

            if (feedComment.deletedAt != null) {
                throw new Error('FeedComment is already marked as deleted');
            }

            feedComment.deletedAt = new Date();
            const removedFeedComment = await this.feedCommentRepository.save(feedComment);
            
            delete removedFeedComment.user
            delete removedFeedComment.isDeleted
            delete removedFeedComment.updatedAt
            delete removedFeedComment.createdAt
            delete removedFeedComment.content
            
            return removedFeedComment;

        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to mark feedComment as deleted');
        }
    }

    async findOne(data: Partial<FeedComment>): Promise<FeedComment> {
        const feedComment = await this.feedCommentRepository.findOneBy({ feedCommentId: data.feedCommentId });
        if (!feedComment) {
            throw new UnauthorizedException('Could not find feedComment')
        }
        return feedComment;
    }

    }

