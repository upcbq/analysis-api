import mongoose from 'mongoose';
import { IVerseJson, VerseSchema } from '@shared/verse.model';

export * from '@shared/verse.model';
export default mongoose.model<IVerseJson>('Verse', VerseSchema);
