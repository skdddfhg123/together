import { Calendar } from "src/calendar/entities/calendar.entity";
import { EmojiInFeed } from "src/db/emoji_feed/entities/emoji.feed.entity";
import { User } from "src/db/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('emoji')
export class Emoji {

    //Auto
    @PrimaryGeneratedColumn('uuid')
    emojiId: string;

    // Auto (Auth)
    @ManyToOne(() => User, user => user.emojis)
    @JoinColumn({ name: 'userId' })
    user: User;

    // Auto (Param)
    @ManyToOne(() => Calendar, calendar => calendar.emojis)
    @JoinColumn({ name: 'calendarId' })
    calendar: Calendar;


    // Client Input
    @Column()
    emojiUrl: string;

    @Column()
    emojiName: string;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, default: null })
    deletedAt: Date;

    @OneToMany(() => EmojiInFeed, emojiInFeed => emojiInFeed.emoji)
    emojisInFeed: EmojiInFeed[];

}