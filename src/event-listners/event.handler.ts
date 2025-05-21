import { SuiEvent } from '@mysten/sui/client';
import { prisma } from '../db';
import type { PrismaPromise } from 'generated/prisma';

type Payload = Record<string, any>;

export const eventEvents = async (
  events: SuiEvent[],
  moduleType: string
) => {
  const ops: PrismaPromise<any>[] = [];

  for (const evt of events) {
    if (!evt.type.startsWith(moduleType)) {
      throw new Error(`Expected events from ${moduleType}, got ${evt.type}`);
    }

    const parts = evt.type.split('::');
    const eventName = parts[parts.length - 1]!;
    const data = evt.parsedJson as Payload;

    switch (eventName) {
      case 'MusicAddedEvent': {
        const { id, metadata } = data;
        console.log(metadata);
        ops.push(
          prisma.track.upsert({
            where: { id: id },
            create: {
              id,
              title: metadata.title,
              artist: metadata.artist,
              CoverUrl: metadata.coverUrl,
              genre: metadata.genre,
              duration: metadata.duration,
              blobId: metadata.blobId,
              blobObjectId: metadata.blobObjectId,
              creatorAddress: metadata.creatorAddress,
              creatorId: metadata.creatorId,
              downloads: metadata.downloads,
            },
            update: {},
          })
        );
        break;
      }

      case 'PlaylistCreatedEvent': {
        const { id, creator, name, description, is_public, created_at } = data;
        ops.push(
          prisma.playlist.upsert({
            where: { id },
            create: {
              id,
              name,
              creator,
              is_public,
              description,
            },
            update: {},
          })
        );
        break;
      }

      case 'DownloadEvent': {
        const { creator, track_id, downloads } = data;
        ops.push(
          prisma.track.updateMany({
            where: { id: track_id },
            data: { downloads: downloads }
          })
        );
        break;
      }

      case "SongAddedToPlaylistEvent": {
        const { playlist_id, track_id, adder } = data;
        ops.push(
          prisma.playlistTrack.upsert({
            where: {
              playlistId_trackId: {
                playlistId: playlist_id,
                trackId: track_id,
              },
            },
            create: {
              playlistId: playlist_id,
              trackId: track_id,
            },
            update: {},
          })
        );
        break;
      }


      default:
        break;
    }
  }
  await prisma.$transaction(ops);
};