import { Disk } from 'flydrive';
import { FSDriver } from 'flydrive/drivers/fs';

export const disk = new Disk(new FSDriver({
  location: new URL(process.env.UPLOAD_DIR!, import.meta.url) , // e.g. /app/storage/uploads
  visibility: 'public',
}));


