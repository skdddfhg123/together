import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Feed } from '../../../feed/entities/feed.entity';

@Entity('feedImage')
export class FeedImage {

    //Auto
    @PrimaryGeneratedColumn('uuid')
    feedImageId: string;

    //Auto 
    @ManyToOne(() => Feed, feed => feed.feedImages)
    @JoinColumn({ name: 'feedId' })
    feed: Feed;

    // Client Input
    @Column()
    imageSrc: string;



    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, default: null })
    deletedAt: Date;

    // Discard Later
    @Column({default : false})
    isDeleted: boolean;
}
