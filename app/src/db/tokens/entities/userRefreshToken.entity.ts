import { IsString } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity({name: 'refresh_token'})
export class UserRefreshToken {

    @PrimaryGeneratedColumn('uuid')
    refreshId: string;

    @Column({nullable: true})
    @IsString()
    jwtRefreshToken: string;

    @Column({nullable: true})
    @IsString()
    kakaoRefreshToken: string;

    @Column({nullable: true})
    @IsString()
    googleRefreshToken: string;

    @Column({nullable: true})
    @IsString()
    outlookRefreshToken: string;

    @Column({nullable: true})
    @IsString()
    discordRefreshToken: string;

    @OneToOne(() => User, user => user.refreshToken)
    @JoinColumn({name: 'userId'})
    user: User;
}