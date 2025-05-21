import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EventListnersService } from './event-listners/event-listners.service';
import { EventListnersModule } from './event-listners/event-listners.module';
import { BluetuneModule } from './bluetune/bluetune.module';

@Module({
  imports: [PrismaModule, EventListnersModule, BluetuneModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}