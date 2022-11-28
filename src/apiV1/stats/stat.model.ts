import { IWordReference } from '@/apiV1/manualTags/manualTag.model';

export interface IStat {
  type: 'word' | 'phrase';
  count: number;
  text: string;
  references: IWordReference[];
  verseList: string;
  verseIndex: number;
}
