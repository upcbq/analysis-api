import { internalServerError } from '@shared/helpers/errorHandler';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { getAutoTagModel } from '@/apiV1/autoTags/autoTag.model';
import { IGetVerseTagsParams } from '@/types/requests/tag/getVerseTagsRequest';
import { getManualTagModel } from '@/apiV1/manualTags/manualTag.model';
import {
  IGetVersesTagsParams,
  IGetVersesTagsQuery,
  IGetVersesTagsRequest,
} from '@/types/requests/tag/getVersesTagsRequest';

async function getModels(verseListId: string) {
  const AutoTag = getAutoTagModel(verseListId);
  const ManualTag = getManualTagModel(verseListId);

  return {
    AutoTag,
    ManualTag,
  };
}

const MAX_VERSES = 50;

export class TagController {
  public static async getVerseTags(req: Request<IGetVerseTagsParams>, res: Response) {
    try {
      const { AutoTag, ManualTag } = await getModels(req.params.verseListId);

      const autoTags = await AutoTag.find({
        verseList: req.params.verseListId,
        verseIndex: +req.params.verseIndex,
      }).exec();
      const manualTags = await ManualTag.find({
        verseList: req.params.verseListId,
        verseIndex: +req.params.verseIndex,
      }).exec();

      res.status(httpStatus.OK).json([...autoTags, ...manualTags]);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  public static async getVersesTags(req: Request<IGetVersesTagsParams, any, IGetVersesTagsRequest>, res: Response) {
    try {
      if (req.body.verses.length > MAX_VERSES) {
        return res.status(httpStatus.BAD_REQUEST).json({
          errors: [
            {
              message: `Exceeded maximum of ${MAX_VERSES} verses per request.`,
            },
          ],
        });
      }
      const { AutoTag, ManualTag } = await getModels(req.params.verseListId);
      const autoTags = await AutoTag.find({
        verseList: req.params.verseListId,
        verseIndex: {
          $in: req.body.verses,
        },
      }).exec();
      const manualTags = await ManualTag.find({
        verseList: req.params.verseListId,
        verseIndex: {
          $in: req.body.verses,
        },
      }).exec();

      res.status(httpStatus.OK).json([...autoTags, ...manualTags]);
      res.status(httpStatus.OK);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  public static async getVerselistTags(
    req: Request<IGetVersesTagsParams, any, any, IGetVersesTagsQuery>,
    res: Response,
  ) {
    try {
      const start = +(req.query.start || 0);
      const end =
        typeof req.query.end === 'string' || typeof req.query.end === 'number' ? +req.query.end : start + MAX_VERSES;

      if (end - start > MAX_VERSES) {
        return res.status(httpStatus.BAD_REQUEST).json({
          errors: [
            {
              message: `Exceeded maximum of ${MAX_VERSES} verses per request.`,
            },
          ],
        });
      }

      const { AutoTag, ManualTag } = await getModels(req.params.verseListId);
      const autoTags = await AutoTag.find({ verseIndex: { $gte: start, $lt: end } })
        .sort({ verseIndex: 'asc', wordIndex: 'asc' })
        .exec();
      const manualTags = await ManualTag.find({ verseIndex: { $gte: start, $lt: end } })
        .sort({ verseIndex: 'asc', wordIndex: 'asc' })
        .exec();

      res.status(httpStatus.OK).json([...autoTags, ...manualTags]);
      res.status(httpStatus.OK);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}
