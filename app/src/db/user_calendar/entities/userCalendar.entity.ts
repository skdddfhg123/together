import { Calendar } from "src/calendar/entities/calendar.entity";
import { GroupEvent } from "src/db/event/group_event/entities/groupEvent.entity";
import { User } from "src/db/user/entities/user.entity";
import { OneToMany } from "typeorm";
import { Entity, JoinColumn, ManyToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('user_calendar')
export class UserCalendar {
    @PrimaryGeneratedColumn('uuid')
    userCalendarId: string;
    
    @OneToOne(() => User, user => user.userCalendars)
    @JoinColumn({ name: 'userId'})
    user: User

    // @ManyToMany(() => Calendar, calendar => calendar.userCalendars )
    // calendars: Calendar[];

    // @OneToMany(() => GroupEvent, groupEvent => groupEvent.userCalendar )
    // groupEvents: GroupEvent[];
    
}