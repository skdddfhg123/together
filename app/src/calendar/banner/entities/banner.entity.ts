import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";
import { Calendar } from "src/calendar/entities/calendar.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Banner {

    @PrimaryGeneratedColumn('uuid')
    bannerId: string;

    @ApiProperty({
        example: 'https://jungle-toogether.s3.ap-northeast-2.amazonaws.com/profiles/51921f3d-51cd-4152-9b31-69d38d63e5c0_app.png',
        description: '배너 이미지 url(default: none)'
    })
    @Column({default: 'none', nullable: true})
    @IsString()
    @IsOptional()
    appBannerUrl?: string;

    @ApiProperty({
        example: 'https://jungle-toogether.s3.ap-northeast-2.amazonaws.com/profiles/51921f3d-51cd-4152-9b31-69d38d63e5c0_web.png',
        description: '배너 이미지 url(default: none)'
    })
    @Column({default: 'none', nullable: true})
    @IsString()
    @IsOptional()
    webBannerUrl?: string;

    @ApiProperty({
        example: '50',
        description: '배너 이미지 투명도(Default: 100, 숫자 기입)'
    })
    @Column({default: 100, nullable: true})
    @IsString()
    @IsOptional()
    alpha?: string;

    @ApiProperty({
        example: '#0086FF',
        description: '배너 텍스트 컬러(Default: #000000)'
    })
    @Column({default: '#000000', nullable: true})
    @IsString()
    @IsOptional()
    textColor?: string;
    
    @OneToOne(() => Calendar, calendar => calendar.banner)
    @JoinColumn({ name: 'calendarId' })
    calendar: Calendar;
}
