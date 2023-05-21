import { IWordReference } from '@/apiV1/manualTags/manualTag.model';
import { IVerseList } from '@/models/verseList.model';
import mongoose from 'mongoose';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     AutoTag:
 *       type: object
 *       properties:
 *         verseIndex:
 *           type: number
 *         wordIndex:
 *           type: number
 *         tag:
 *           type: string
 *         length:
 *           type: number
 */

export interface IAutoTagJson {
  tag: string;
  verseIndex: number;
  wordIndex: number;
  length: number;
}

export interface IAutoTag extends mongoose.Document {
  tag: string;
  refString: string;
  verseIndex: number;
  wordIndex: number;
  length: number;
}

export const AutoTagSchema = new mongoose.Schema(
  {
    wordIndex: {
      type: Number,
      required: true,
    },
    verseIndex: {
      type: Number,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: false,
    useNestedStrict: true,
  },
);

AutoTagSchema.index({ verseIndex: 1, wordIndex: 1 }, { unique: false });
AutoTagSchema.index({ verseIndex: 1, tag: 1, wordIndex: 1 }, { unique: true });
AutoTagSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
    delete ret._id;
  },
});

const modelCache: Record<string, mongoose.Model<IAutoTag, {}, {}>> = {};
export function getAutoTagModel(verseList: IVerseList | string, skipInit = true) {
  const vlId = typeof verseList === 'string' ? verseList : verseList._id;
  if (modelCache[vlId] && skipInit) {
    return modelCache[vlId];
  }
  modelCache[vlId] = mongoose.model<IAutoTag>(`${getAutoTagCollectionName(vlId)}`, AutoTagSchema, undefined, skipInit);
  return modelCache[vlId];
}

export function getAutoTagCollectionName(verseListId: string) {
  return `${verseListId}.AutoTag`;
}
