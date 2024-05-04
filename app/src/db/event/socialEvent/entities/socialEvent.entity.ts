import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserCalendar } from "../../../user_calendar/entities/userCalendar.entity";
import { IsNotEmpty, IsOptional } from "class-validator";

@Entity('social_event')
@Unique(['social', 'startAt', 'endAt', 'userCalendar'] )
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