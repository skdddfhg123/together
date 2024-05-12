import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Emoji } from "src/emoji/entities/emoji.entity";
import { GroupEvent } from "src/db/event/group_event/entities/groupEvent.entity";
import { UserCalendar } from "src/db/user_calendar/entities/userCalendar.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Calendar {
    @PrimaryColumn('uuid')
    calendarId: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    title: string;

    @Column({ nullable: true })
    @IsString()
    coverImage: string;

    @Column({ nullable: true })
    @IsString()
    bannerImage: string;

    @Column({ nullable: true })
    @IsString()
    type: string;

    @ManyToOne(() => UserCalendar, (userCalendar) => userCalendar.groupCalendar)
    @JoinColumn({ name: 'calendars' })
    author: UserCalendar;

    @Column("uuid", { array: true })
    attendees: string[];

    @CreateDateColumn()
    registeredAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    @ApiProperty({ description: 'The date when the user was deleted', example: '2023-01-03T00:00:00.000Z' })
    deletedAt?: Date;

    @OneToMany(() => GroupEvent, (groupEvent) => groupEvent.calendarId) // 그룹 이벤트
    groupEvents: GroupEvent[];

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => Emoji, emoji => emoji.calendar)
    emojis: Emoji[];

}