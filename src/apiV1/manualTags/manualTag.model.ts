import { IReference } from '@shared/types/reference';
import mongoose from 'mongoose';
import { IVerseList } from '@/models/verseList.model';

export type IWordReference = IReference & {
  word: number;
};

export interface IManualTagJson {
  verseIndex: number;
  wordIndex: number;
  tag?: string;
  removeTags?: string[];
  length: number;
}

export interface IManualTag extends mongoose.Document {
  verseIndex: number;
  wordIndex: number;
  tag?: string;
  removeTags?: string[];
  length: number;
}

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     ManualTag:
 *       type: object
 *       properties:
 *         verseIndex:
 *           type: number
 *         wordIndex:
 *           type: number
 *         tag:
 *           type: string
 *           required: false
 *         removeTags:
 *           type: array
 *           items:
 *             type: string
 *         length:
 *           type: number
 */

export const ManualTagSchema = new mongoose.Schema(
  {
    verseIndex: {
      type: Number,
      required: true,
    },
    wordIndex: {
      type: Number,
      required: true,
    },
    tag: {
      type: String,
      required: false,
    },
    removeTags: {
      type: [String],
      required: false,
    },
    length: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    toObject: {
      virtuals: ['reference'],
    },
    timestamps: false,
    useNestedStrict: true,
  },
);

ManualTagSchema.index({ wordIndex: 1, verseIndex: 1 }, { unique: false });
ManualTagSchema.index({ wordIndex: 1, verseIndex: 1, tag: 1, removeTags: 1 }, { unique: true });
ManualTagSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
    delete ret._id;
  },
});

const modelCache: Record<string, mongoose.Model<IManualTag, {}, {}>> = {};
export function getManualTagModel(verseList: IVerseList | string, skipInit = true) {
  const vlId = typeof verseList === 'string' ? verseList : verseList._id;
  if (modelCache[vlId] && skipInit) {
    return modelCache[vlId];
  }
  return mongoose.model<IManualTag>(`${getManualTagCollectionName(vlId)}`, ManualTagSchema, undefined, skipInit);
}

export function getManualTagCollectionName(verseListId: string) {
  return `${verseListId}.ManualTag`;
}
