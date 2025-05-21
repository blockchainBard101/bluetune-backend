import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BluetuneService {
    constructor(private readonly prisma: PrismaService) { }

    getAllTracks() {
        return this.prisma.track.findMany();
    }

    getAllPlaylists() {
        return this.prisma.playlist.findMany({
            include: {
                tracks: {
                    include: {
                        track: true,
                    },
                },
            },
        });
    }

    getPlaylistsByCreator(creatorId: string) {
        return this.prisma.playlist.findMany({
            where: { creator: creatorId },
            include: {
                tracks: {
                    include: {
                        track: true,
                    },
                },
            },
        });
    }
}