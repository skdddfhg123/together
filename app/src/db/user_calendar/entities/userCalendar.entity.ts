import { Calendar } from "src/calendar/entities/calendar.entity";
import { User } from "src/db/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SocialEvent } from "../../event/socialEvent/entities/socialEvent.entity";

@Entity('user_calendar')
export class UserCalendar {
    @PrimaryGeneratedColumn('uuid')
    userCalendarId: string;

    @OneToOne(() => User, user => user.userCalendarId)
    @JoinColumn({ name: 'userId' })
    user: User

    @OneToMany(() => Calendar, calendar => calendar.author)
    @JoinColumn({ name: 'userCalendars' })
    groupCalendar: Calendar[];

    @Column("uuid", { array: true, nullable: true, default: [] })
    groupCalendars: string[];

    @OneToMany(() => SocialEvent, socialEvents => socialEvents.userCalendar)
    socialEvents: SocialEvent[];
}
