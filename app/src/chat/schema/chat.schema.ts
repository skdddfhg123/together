import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Chat extends Document {
    @ApiProperty({ description: 'Sender of the chat message' })
    @Prop({ required: true })
    sender: string;

    @ApiProperty({ description: 'Content of the chat message' })
    @Prop({ required: true })
    message: string;

    @ApiProperty({ description: 'Timestamp of the chat message', default: Date.now })
    @Prop({ default: Date.now })
    timestamp: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);