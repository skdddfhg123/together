import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Document, SchemaOptions, Types, Schema as MongooseSchema } from "mongoose";

@Schema()
export class Chat extends Document {
    @Prop({
        required: true,
        unique: false,
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @Prop({
        required: false,
        unique: false,
    })
    @IsString()
    @IsOptional()
    nickname: string;

    @Prop({
        required: false,
        unique: false,
    })
    @IsString()
    @IsOptional()
    message: string;

    @Prop({
        required: false,
        unique: false,
    })
    @IsString()
    @IsOptional()
    imgUrl: string;

    @Prop(raw({
        type: Date,
        default: () => Date.now()
    }))
    registeredAt: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    public _id: Types.ObjectId;
}

// 아래 코드는 이미 작성하신 것으로 보이는데, 문제의 파일에서 내보내는 부분을 재확인하시기 바랍니다.
export const ChatSchema = SchemaFactory.createForClass(Chat);
