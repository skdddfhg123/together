import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Document, SchemaOptions } from "mongoose";

@Schema()
export class Chat extends Document{
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
}

export const ChatSchema = SchemaFactory.createForClass(Chat);