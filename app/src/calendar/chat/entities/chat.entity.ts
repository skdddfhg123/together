import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    chatId : string;

    @Column()
    nickname: string;

    @Column()
    message: string;

    @CreateDateColumn()
    registeredAt: Date;
   
    // @OneToOne(() => UserCalendar, userCalendar => userCalendar.user)
    // @JoinColumn({ name: 'userCalendarId' })
    // userCalendarId: UserCalendar
}
