import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/db/user/entities/user.entity";
import { UserCalendar } from "src/db/user_calendar/entities/userCalendar.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Calendar{
    @PrimaryGeneratedColumn('uuid')
    calendarId: string;

    @Column({ nullable: false })
    authorId: string;

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

    @ManyToMany(() => UserCalendar, (userCalendar) => userCalendar.calendars)
    @JoinTable()
    userCalendars: UserCalendar[];

    @CreateDateColumn()
    registeredAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    @ApiProperty({ description: 'The date when the user was deleted', example: '2023-01-03T00:00:00.000Z' })
    deletedAt?: Date;

    // @OneToMany(() => ) // 그룹 이벤트
}