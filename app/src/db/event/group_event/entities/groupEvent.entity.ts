import { Calendar } from 'src/calendar/entities/calendar.entity';
import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('group_event')
export class GroupEvent {
    @PrimaryGeneratedColumn('uuid')
    groupEventId: string;

    @ManyToOne(() => Calendar, (calendar) => calendar.calendarId, {eager: true,})
    calendarId: string;

    @Column()
    author: string;

    @Column('simple-array', { nullable: true })
    member: string[];

    @Column()
    title: string;

    @Column()
    color: string;

    @Column({default : false})
    pinned: boolean;

    @Column({nullable : true})
    alerts: number;

    @Column({ type: 'jsonb', nullable: true })
    attachment: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    startAt: Date;

    @Column()
    endAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({default : false})
    isDeleted: boolean;
}
