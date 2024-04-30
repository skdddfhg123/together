import { Calendar } from "src/calendar/entities/calendar.entity";
import { User } from "src/db/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserCalendar } from "./userCalendar.entity";
import { IsNotEmpty, IsOptional } from "class-validator";

@Entity('social_event')
export class SocialEvent {

    @PrimaryGeneratedColumn('uuid')
    socialEventId: string;

    @ManyToOne(() => UserCalendar, calendar => calendar.socialEvents, {nullable: true})
    @JoinColumn({ name: 'userCalendarId' })
    userCalendar: UserCalendar;

    @Column()
    @IsNotEmpty()
    social: string;

    @Column({nullable: true})
    @IsOptional()
    title: string;

    @Column('timestamp')
    @IsNotEmpty()
    startAt: Date;

    @Column('timestamp')
    @IsNotEmpty()
    endAt: Date;

    @Column({ default: false })
    deactivatedAt: boolean;

}