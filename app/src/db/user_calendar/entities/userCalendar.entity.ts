import { Calendar } from "src/calendar/entities/calendar.entity";
import { User } from "src/db/user/entities/user.entity";
import { Entity, JoinColumn, ManyToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('user_calendar')
export class UserCalendar {
    @PrimaryGeneratedColumn('uuid')
    userCalendarId: string;
    
    @OneToOne(() => User, user => user.userCalendars)
    @JoinColumn({ name: 'userId'})
    user: User

    @ManyToMany(() => Calendar, calendar => calendar.userCalendars )
    calendars: Calendar[];
}
