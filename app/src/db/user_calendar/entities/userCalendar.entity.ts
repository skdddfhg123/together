import { Calendar } from "src/calendar/entities/calendar.entity";
import { GroupEvent } from "src/db/event/group_event/entities/groupEvent.entity";
import { User } from "src/db/user/entities/user.entity";
import { Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SocialEvent } from "./socialEvent.entity";

@Entity('user_calendar')
export class UserCalendar {
    @PrimaryGeneratedColumn('uuid')
    userCalendarId: string;
    
    @OneToOne(() => User, user => user.userCalendars)
    @JoinColumn({ name: 'userId'})
    user: User

    @OneToMany(() => SocialEvent, socialEvents => socialEvents.userCalendar)
    socialEvents: SocialEvent[];

    // @ManyToMany(() => Calendar, calendar => calendar.userCalendars )
    // calendars: Calendar[];
}
