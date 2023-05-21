import mongoose from 'mongoose';

export interface ITagInfoJson {
  tag: string;
  name: string;
  description?: string;
  style: {
    color?: string;
    backgroundColor?: string;
    textDecoration?: string;
    textTransform?: string;
    fontWeight?: string;
    fontStyle?: string;
  };
}

export interface ITagInfo extends mongoose.Document {
  tag: string;
  name: string;
  description?: string;
  style: {
    color?: string;
    backgroundColor?: string;
    textDecoration?: string;
    textTransform?: string;
    fontWeight?: string;
    fontStyle?: string;
  };
}

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     TagInfo:
 *       type: object
 *       properties:
 *         tag:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           required: false
 *         color:
 *           type: string
 *         backgroundColor:
 *           type: string
 *         fontStyle:
 *           type: string
 *         textDecoration:
 *           type: string
 *         textTransform:
 *           type: string
 */

export const TagInfoSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    style: {
      type: new mongoose.Schema({
        color: {
          type: String,
          required: false,
        },
        backgroundColor: {
          type: String,
          required: false,
        },
        textDecoration: {
          type: String,
          required: false,
        },
        textTransform: {
          type: String,
          required: false,
        },
        fontWeight: {
          type: String,
          required: false,
        },
        fontStyle: {
          type: String,
          required: false,
        },
      }),
      required: true,
    },
  },
  {
    timestamps: false,
    useNestedStrict: true,
  },
);
TagInfoSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
    delete ret._id;
    delete ret.style._id;
  },
});

export default mongoose.model<ITagInfo>(`TagInfo`, TagInfoSchema);
