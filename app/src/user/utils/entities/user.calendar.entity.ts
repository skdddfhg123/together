import { IsNotEmpty, IsString } from "class-validator";
import { Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { CalendarEntity } from "src/calendar/entities/calendar.entity";

@Entity()
export class UserCalendarEntity {

    // ======================================================================================================================
    // Required Column
    // ======================================================================================================================

    @PrimaryColumn()
    @IsString()
    @IsNotEmpty()
    user_calendar_id: string;

    // ======================================================================================================================
    // Optional Column
    // ======================================================================================================================

    @ManyToOne(() => UserEntity, (user) => user.user_calenders)
    user: UserEntity;

    // @ManyToMany(() => CalendarEntity, (calendar) => calendar.user_calendar)
    // calendar: CalendarEntity[];

    // @ManyToOne(() => ) // 그룹 이벤트

    // @OneToMany(() => ) // 소셜 이벤트

}