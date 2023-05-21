import { IWordReference } from '@/apiV1/manualTags/manualTag.model';
import { IVerseList } from '@/models/verseList.model';
import { IReference } from '@shared/types/reference';

export function wordReferenceToString(ref: IWordReference | IReference, index?: number) {
  if (index !== undefined) {
    return `${ref.book}_${ref.chapter}:${ref.verse}.${index}`
  }
  if ((ref as IWordReference).word === undefined) {
    return `${ref.book}_${ref.chapter}:${ref.verse}`;
  }
  return `${ref.book}_${ref.chapter}:${ref.verse}.${(ref as IWordReference).word}`;
}

export function stringToWordReference(ref: string): IWordReference | undefined {
  const match = /(?<book>(?:\w|\d|-)+)_(?<chapter>\d+):(?<verse>\d+).(?<word>\d+)/.exec(ref);
  return match?.groups ? {
    book: match.groups.book,
    chapter: +match.groups.chapter,
    verse: +match.groups.verse,
    word: +match.groups.word,
  } : undefined;
}

export function verseListToId(vl: IVerseList) {
  return `${vl.year}.${vl.organization}.${vl.division}`;
}
