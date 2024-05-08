import { User } from "src/db/user/entities/user.entity";
import { Emoji } from "src/emoji/entities/emoji.entity";
import { Feed } from "src/feed/entities/feed.entity";
import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";




@Entity('emoji_feed')
export class EmojiInFeed {

    //Auto
    @PrimaryGeneratedColumn('uuid')
    emojiInFeedId: string;

    // Auto (Auth)
    @ManyToOne(() => User, user => user.emojisInFeed)
    @JoinColumn({ name: 'userId' })
    user: User;

    // Auto (Param)
    @ManyToOne(() => Feed, feed => feed.emojisInFeed)
    @JoinColumn({ name: 'feedId' })
    feed: Feed;

    
    @ManyToOne(() => Emoji, emoji => emoji.emojisInFeed)
    @JoinColumn({ name: 'emojiId' })
    emoji: Emoji;



    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, default: null })
    deletedAt: Date;


}