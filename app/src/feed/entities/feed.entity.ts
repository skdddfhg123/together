

import { GroupEvent } from 'src/db/event/group_event/entities/groupEvent.entity';
import { User } from 'src/db/user/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { FeedImage } from '../../db/feedImage/entities/feedImage.entity';
import { FeedComment } from 'src/db/comment/entities/comment.entity';

@Entity('feed')
export class Feed {

    // Auto 
    @PrimaryGeneratedColumn('uuid') 
    feedId: string;



    // Auto (Auth)
    @ManyToOne(() => User, user => user.feeds)
    @JoinColumn({ name: 'userId' })
    user: User;

    // Auto (Param)
    @ManyToOne(() => GroupEvent, groupEvent => groupEvent.feeds)
    @JoinColumn({ name: 'groupEventId' })
    groupEventId: string;



    // Client Inputs
    @Column()
    feedType: number;

    @Column()
    title: string;

    @Column()
    content: string;



    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, default: null })
    deletedAt: Date;

    // Discard Later
    @Column({default : false})
    isDeleted: boolean;



    ///////////////////// Not in Actual DB /////////////////////////
   
    @OneToMany(() => FeedImage, feedImage => feedImage.feed)
    feedImages: FeedImage[];


    @OneToMany(() => FeedComment, FeedComment => FeedComment.feedId)
    feedComments: FeedComment[];
}
