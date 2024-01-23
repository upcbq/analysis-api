import mongoose from 'mongoose';
import { IVerseList } from '@/models/verseList.model';
import { stringToVerseListReference, verseListReferenceToString } from '@shared/utilities/utilityFunctions';
import { IVerseListWordReference } from '@shared/types/reference';

export interface IStat {
  type: 'word' | 'phrase';
  length: number;
  count: number;
  text: string;
  references: IVerseListWordReference[];
  sortOrder: number;
}

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     VerseListReference:
 *       type: object
 *       properties:
 *         verseIndex:
 *           type: number
 *     VerseListWordReference:
 *       type: object
 *       allOf:
 *       - $ref: '#/components/schemas/VerseListReference'
 *       - type: object
 *         properties:
 *           wordIndex:
 *             type: number
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
 *             $ref: '#/components/schemas/VerseListWordReference'
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
    references: {
      type: [
        {
          _id: false,
          verseIndex: Number,
          wordIndex: Number,
        },
      ],
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
      transform(doc, ret, options) {
        delete ret.__v;
        delete ret._id;
      },
    },
    toObject: {
      transform(doc, ret, options) {
        delete ret.__v;
        delete ret._id;
      },
    },
    timestamps: false,
    useNestedStrict: true,
  },
);

StatSchema.index({ text: 1 }, { unique: true });
StatSchema.index({ type: 1 }, { unique: false });
StatSchema.index({ type: 1, sortOrder: 1 }, { unique: true });

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
