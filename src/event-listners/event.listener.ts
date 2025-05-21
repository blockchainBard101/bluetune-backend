import { EventId, SuiClient, SuiEvent, SuiEventFilter } from '@mysten/sui/client';
import { CONFIG } from '../config';
import { prisma } from '../db';
import { getClient } from '../sui-utils';
import { eventEvents } from './event.handler';

type SuiEventsCursor = EventId | null | undefined;

type EventExecutionResult = {
  cursor: SuiEventsCursor;
  hasNextPage: boolean;    
};

type EventTracker = {
  type: string;                       
  filter: SuiEventFilter;
  callback: (events: SuiEvent[], type: string) => Promise<any>;
};

const TRACKERS: EventTracker[] = [
  {
    type: `${CONFIG.BLUETUNE_PACKAGE_ID}::bluetune`,
    filter: {
      MoveEventModule: {
        package: CONFIG.BLUETUNE_PACKAGE_ID,
        module: 'bluetune',
      },
    },
    callback: eventEvents,
  },
];

const executeEventJob = async (
  client: SuiClient,
  tracker: EventTracker,
  cursor: SuiEventsCursor
): Promise<EventExecutionResult> => {
  try {
    const { data, hasNextPage, nextCursor } = await client.queryEvents({
      query:  tracker.filter,
      cursor,
      order:  'ascending',
    });

    await tracker.callback(data, tracker.type);

    if (nextCursor && data.length > 0) {
      await saveLatestCursor(tracker, nextCursor);
      return { cursor: nextCursor, hasNextPage };
    }
  } catch (e) {
    console.error('Error in executeEventJob:', e);
  }

  return { cursor, hasNextPage: false };
};

const runEventJob = async (
  client: SuiClient,
  tracker: EventTracker,
  cursor: SuiEventsCursor
) => {
  const result = await executeEventJob(client, tracker, cursor);
  setTimeout(
    () => runEventJob(client, tracker, result.cursor),
    result.hasNextPage ? 0 : CONFIG.POLLING_INTERVAL_MS
  );
};

const getLatestCursor = async (tracker: EventTracker) => {
  const record = await prisma.cursor.findUnique({
    where: { id: tracker.type },
  });
  return record ? { eventSeq: record.eventSeq, txDigest: record.txDigest } : undefined;
};

const saveLatestCursor = async (tracker: EventTracker, cursor: EventId) => {
  const data = {
    eventSeq: cursor.eventSeq,
    txDigest: cursor.txDigest,
  };
  return prisma.cursor.upsert({
    where: { id: tracker.type },
    update: data,
    create: { id: tracker.type, ...data },
  });
};


export const setupEventListeners = async () => {
  for (const tracker of TRACKERS) {
    const cursor = await getLatestCursor(tracker);
    runEventJob(getClient(CONFIG.NETWORK), tracker, cursor);
  }
};