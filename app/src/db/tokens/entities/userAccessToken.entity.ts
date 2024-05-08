import { IsString } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity({ name: 'access_token' })
export class UserAccessToken {

    @PrimaryGeneratedColumn('uuid')
    accessId: string;

    @Column({ nullable: true })
    @IsString()
    jwtAccessToken: string;

    @Column({ nullable: true })
    @IsString()
    kakaoAccessToken: string;

    @Column({ nullable: true })
    @IsString()
    googleAccessToken: string;

    @Column({ nullable: true })
    @IsString()
    outlookAccessToken: string;

    @Column({ nullable: true })
    @IsString()
    discordAccessToken: string;

    @OneToOne(() => User, user => user.accessToken)
    @JoinColumn({ name: 'userId' })
    user: User;
}