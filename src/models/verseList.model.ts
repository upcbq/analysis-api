import mongoose from 'mongoose';
import { IVerseList, VerseListSchema } from '@shared/verseList.model';

export * from '@shared/verseList.model';
export default mongoose.model<IVerseList>('VerseList', VerseListSchema);
