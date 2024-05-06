import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary', description: 'Upload your image here' })
    file: any;
}