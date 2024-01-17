import { IWordReference } from '@/apiV1/manualTags/manualTag.model';
import { IVerseList } from '@/models/verseList.model';
import { stringToWordReference, wordReferenceToString } from '@/utils/utilityFunctions';
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
  related: IWordReference[];
}

export interface IAutoTag extends mongoose.Document {
  tag: string;
  refString: string;
  verseIndex: number;
  wordIndex: number;
  length: number;
  related: IWordReference[];
}

export const AutoTagSchema = new mongoose.Schema<IAutoTag>(
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
    relatedRefs: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: false,
    useNestedStrict: true,
    toJSON: {
      virtuals: ['related'],
      transform(doc, ret, options) {
        delete ret.__v;
        delete ret._id;
        delete ret.relatedRefs;
      },
    },
    toObject: {
      virtuals: ['related'],
    },
  },
);

AutoTagSchema.index({ verseIndex: 1, wordIndex: 1 }, { unique: false });
AutoTagSchema.index({ verseIndex: 1, tag: 1, wordIndex: 1 }, { unique: true });
AutoTagSchema.virtual('related')
  .get(function () {
    return (this.relatedRefs || []).map((ref: string) => stringToWordReference(ref));
  })
  .set(function (val: IWordReference[] | string[]) {
    const result = (val || []).map((v: IWordReference | string) => {
      if (typeof v === 'string') return v;
      return wordReferenceToString(v);
    });
    this.set('relatedRefs', result);
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
  return `${verseListId}.autotags`;
}
