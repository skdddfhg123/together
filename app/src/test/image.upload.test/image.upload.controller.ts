import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ImageUploadTestService } from "./image.upload.service";
import { SingleImageUploadTestDto } from "./dtos/image.dto";
import { MultipleImageUploadTestDto } from "./dtos/images.dto";
import { SingleImageAndTextUploadTestDto } from "./dtos/image.text.dto";
import { MultipleImageAndTextUploadTestDto } from "./dtos/images.text.dto";



@ApiTags("imageTest")
@Controller('imagetest')
export class ImageUploadTestController {

    constructor(
        private imageUploadTestService: ImageUploadTestService,
    ) {}



    //이미지 1개 테스트
    @ApiOperation({ summary: 'Upload single image for Test' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
    description: 'image upload',
    type: SingleImageUploadTestDto,
    })
    @UseInterceptors(FileInterceptor('file'))
    @Post('image/single')
    async singleImageUploadTest(@UploadedFile() file: Express.Multer.File) {
    return await this.imageUploadTestService.singleImageUploadTest(file);
    }


    // 이미지 여러개 테스트
    @Post('image/multy')
    @ApiOperation({ summary: 'Upload multiple images for Test' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: MultipleImageUploadTestDto })
    @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 5 }
    ]))
    async multipleImageUploadTest(@UploadedFiles() files: { images?: Express.Multer.File[] }) {
    if (!files.images || files.images.length === 0) {
        return { message: 'No images uploaded' };
    }
    return await this.imageUploadTestService.multipleImageUploadTest(files.images);
    }




    // 이미지 1개, 텍스트 테스트
    @ApiOperation({ summary: 'Upload single image with text form for Test' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
    description: 'image upload',
    type: SingleImageAndTextUploadTestDto,
    })
    @UseInterceptors(FileInterceptor('file'))
    @Post('image/single/text')
    async singleImageAndTextUploadTest(
        @UploadedFile() file: Express.Multer.File,
        @Body() singleImageAndTextUploadTest: SingleImageAndTextUploadTestDto )
        :Promise<{imageUrl : string, title : string, description : string}> {     
        return await this.imageUploadTestService.singleImageAndTextUploadTest(file, singleImageAndTextUploadTest);
    }


    // 이미지 여러개, 텍스트 테스트
    @Post('image/multy/text')
    @ApiOperation({ summary: 'Upload multiple images and text for Test' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: MultipleImageAndTextUploadTestDto })
    @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 5 }
    ]))
    async multipleImageAndTextUploadTest(
        @UploadedFiles() files: { images?: Express.Multer.File[] },
        @Body() multipleImageAndTextUploadTestDto: MultipleImageAndTextUploadTestDto
    ) {
    if (!files.images || files.images.length === 0) {
        return { message: 'No images uploaded' };
    }
    return await this.imageUploadTestService.multipleImageAndTextUploadTest(files.images, multipleImageAndTextUploadTestDto);
    
    }

}