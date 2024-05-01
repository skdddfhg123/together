import { Calendar } from "src/calendar/entities/calendar.entity";
import { GroupEvent } from "src/db/event/group_event/entities/groupEvent.entity";
import { User } from "src/db/user/entities/user.entity";
import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SocialEvent } from "./socialEvent.entity";

@Entity('user_calendar')
export class UserCalendar {
    @PrimaryGeneratedColumn('uuid')
    userCalendarId: string;
    
    @OneToOne(() => User, user => user.userCalendarId)
    @JoinColumn({ name: 'userId'})
    user: User

    @OneToMany(() => Calendar, calendar => calendar.author )
    @JoinColumn({ name: 'userCalendars'})
    groupCalendar: Calendar[];

    @OneToMany(() => SocialEvent, socialEvents => socialEvents.userCalendar)
    socialEvents: SocialEvent[];
}
