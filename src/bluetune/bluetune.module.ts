import { Module } from '@nestjs/common';
import { BluetuneService } from './bluetune.service';
import { BluetuneController } from './bluetune.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  providers: [BluetuneService, PrismaService],
  controllers: [BluetuneController]
})
export class BluetuneModule {}
