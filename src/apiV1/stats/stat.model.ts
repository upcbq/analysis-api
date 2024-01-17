import mongoose from 'mongoose';
import { IWordReference } from '@/apiV1/manualTags/manualTag.model';
import { IVerseList } from '@/models/verseList.model';
import { stringToWordReference, wordReferenceToString } from '@/utils/utilityFunctions';

export interface IStat {
  type: 'word' | 'phrase';
  length: number;
  count: number;
  text: string;
  references: IWordReference[];
  sortOrder: number;
}

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Stat:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *         count:
 *           type: number
 *         length:
 *           type: number
 *         text:
 *           type: string
 *         sortOrder:
 *           type: number
 *         references:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Reference'
 *     LiteStat:
 *       type: object
 *       properties:
 *         count:
 *           type: number
 *         text:
 *           type: string
 */

export const StatSchema = new mongoose.Schema(
  {
    refs: {
      type: [String],
      required: true,
      default: [],
    },
    length: {
      type: Number,
      required: true,
      default: 1,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
    },
    sortOrder: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: ['references'],
      transform(doc, ret, options) {
        delete ret.__v;
        delete ret._id;
        delete ret.refs;
      },
    },
    toObject: {
      virtuals: ['references'],
      transform(doc, ret, options) {
        delete ret.__v;
        delete ret._id;
        delete ret.refs;
      },
    },
    timestamps: false,
    useNestedStrict: true,
  },
);

StatSchema.index({ text: 1 }, { unique: true });
StatSchema.index({ type: 1 }, { unique: false });
StatSchema.index({ type: 1, sortOrder: 1 }, { unique: true });
StatSchema.virtual('references')
  .get(function() {
    return (this.refs || []).map((ref: string) => stringToWordReference(ref));
  })
  .set(function (val: IWordReference[] | string[]) {
    this.set('refs', (val || []).map((val: IWordReference | string) => {
      if (typeof val === 'string') return val;
      return wordReferenceToString(val);
    }));
  });

const modelCache: Record<string, mongoose.Model<IStat, {}, {}>> = {};
export function getStatModel(verseList: IVerseList | string, skipInit = true) {
  const vlId = typeof verseList === 'string' ? verseList : verseList._id;
  if (modelCache[vlId] && skipInit) {
    return modelCache[vlId];
  }
  return mongoose.model<IStat>(`${getStatCollectionName(vlId)}`, StatSchema, undefined, skipInit);
}

export function getStatCollectionName(verseListId: string) {
  return `${verseListId}.stats`;
}
