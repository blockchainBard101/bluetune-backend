import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { setupEventListeners } from './event.listener';

@Injectable()
export class EventListnersService implements OnApplicationBootstrap{
    onApplicationBootstrap() {
    console.log('EventlistnerService is running');
    setupEventListeners();
  }
}
