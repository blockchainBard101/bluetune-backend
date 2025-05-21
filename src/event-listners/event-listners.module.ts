import { Module } from '@nestjs/common';
import { EventListnersService } from './event-listners.service';

@Module({
    providers: [EventListnersService],
})
export class EventListnersModule {}