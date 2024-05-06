import { User } from "src/db/user/entities/user.entity";
import { Feed } from "src/feed/entities/feed.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('feedComment')
export class FeedComment {

    //Auto
    @PrimaryGeneratedColumn('uuid')
    feedCommentId: string;

    // Auto (Auth)
    @ManyToOne(() => User, user => user.feedComments)
    @JoinColumn({ name: 'userId' })
    user: User;

    // Auto (Param)
    @ManyToOne(() => Feed, feed => feed.feedComments)
    @JoinColumn({ name: 'feedId' })
    feedId: Feed;



    // Client Input
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


    
    
    /*  대댓글 추후에 구현
    @Column({ nullable: true })
    parentId: string;

    @ManyToOne(() => FeedComment, comment => comment.children, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: FeedComment;

    @OneToMany(() => FeedComment, comment => comment.parent)
    children: FeedComment[];
    */
}
