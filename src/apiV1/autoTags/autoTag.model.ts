import { IWordReference } from '@/apiV1/manualTags/manualTag.model';

export interface IAutoTag {
  reference: IWordReference;
  verseList: string;
  verseIndex: number;
  tags: string[];
}
