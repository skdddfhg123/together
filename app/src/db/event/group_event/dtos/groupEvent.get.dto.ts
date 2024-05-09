import { Type } from 'class-transformer';
import { IsUUID, IsString, IsBoolean, IsOptional, ValidateNested, IsArray, IsDate } from 'class-validator';

export class MemberInfo {
    @IsString()
    useremail: string;

    @IsString()
    thumbnail: string;

    @IsString()
    nickname: string;
}

export class GetGroupDTO {
    @IsUUID()
    groupEventId: string;

    @ValidateNested()
    @Type(() => MemberInfo)
    author: MemberInfo;

    @ValidateNested({ each: true })
    @Type(() => MemberInfo)
    @IsArray()
    member: MemberInfo[];

    @IsString()
    title: string;

    @IsString()
    color: string;

    @IsBoolean()
    pinned: boolean;

    @IsOptional()
    alerts: number | null;

    @IsOptional()
    attachment: any;

    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsDate()
    @Type(() => Date)
    updatedAt: Date;

    @IsDate()
    @Type(() => Date)
    startAt: Date;

    @IsDate()
    @Type(() => Date)
    endAt: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    deletedAt: Date | null;

    @IsBoolean()
    isDeleted: boolean;
}