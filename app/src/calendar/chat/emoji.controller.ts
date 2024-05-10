import { Controller, Get } from '@nestjs/common';
import { EmojiService } from './emoji.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Emoji')
@Controller('images')
export class EmojiController {
  constructor(private readonly imagesService: EmojiService) {}

    @ApiOperation({ summary: 'S3 모든 이미지 가져오기' })
    @ApiResponse({ status: 200, description: 'Get All Image URL successfully' })
    // @ApiResponse({ status: 403, description: 'You do not have permission to remove this event' })
    // @ApiResponse({ status: 404, description: 'Group event not found' })
    // @ApiResponse({ status: 500, description: 'Error removing group event' })
    @Get()
    async getImages() {
        const images = await this.imagesService.getImages();
        return images;
    }
}
