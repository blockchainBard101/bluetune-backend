import { Controller, Get, Param } from '@nestjs/common';
import { BluetuneService } from './bluetune.service';

@Controller('bluetune')
export class BluetuneController {
    constructor(private readonly bluetune: BluetuneService) { }

    @Get('tracks')
    getTracks() {
        return this.bluetune.getAllTracks();
    }

    @Get('playlists')
    getPlaylists() {
        return this.bluetune.getAllPlaylists();
    }

    @Get('playlists/creator/:creatorId')
    getPlaylistsByCreator(@Param('creatorId') creatorId: string) {
        return this.bluetune.getPlaylistsByCreator(creatorId);
    }
}
