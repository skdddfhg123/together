import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GifController } from "./gif.controller";
import { GifService } from "./gif.service";


@Module({
    imports: [
      TypeOrmModule.forFeature([]),
      
    ],
    controllers: [GifController],
    providers: [GifService],
      
    
  })
  export class GifModule {}
  