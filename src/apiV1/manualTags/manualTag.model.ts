import { IReference } from '@shared/types/reference';

export type IWordReference = IReference & {
  word: number;
};

export interface IManualTag {
  reference: IWordReference;
  verseList: string;
  verseIndex: number;
  tags: string[];
  removeTags?: string[];
}
