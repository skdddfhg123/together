import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('group_event')
export class GroupEvent {
    @PrimaryGeneratedColumn('uuid')
    groupEventId: string;

    @Column()
    author: string;

    @Column('simple-array')
    member: string[];

    @Column()
    groupName: string;

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

    @Column({default : false})
    deactivatedAt: boolean;
}
