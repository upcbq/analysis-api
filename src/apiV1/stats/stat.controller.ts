import { Request, Response } from 'express';
import { internalServerError } from '@shared/helpers/errorHandler';
import {
  IGetSingleWordStatRequest,
  IGetWordStatsQuery,
  IGetWordStatsRequest,
  IGetWordsStatsQuery,
} from '@/types/requests/stats/getWordStatsRequest';
import {
  IGetPhraseStatsQuery,
  IGetPhraseStatsRequest,
  IGetPhrasesStatsQuery,
  IGetSinglePhraseStatRequest,
} from '@/types/requests/stats/getPhraseStatsRequest';
import { IStat, getStatModel } from './stat.model';
import httpStatus from 'http-status';
import { FilterQuery } from 'mongoose';

const MAX_STATS = 50;

function buildQuery(
  getStatsQuery: IGetPhrasesStatsQuery | IGetWordsStatsQuery,
  type: 'word' | 'phrase',
): FilterQuery<IStat> {
  const min = +getStatsQuery.min;
  const max = +getStatsQuery.max;
  const query: FilterQuery<IStat> = { type };
  if (!isNaN(min)) {
    if (!query.count) {
      query.count = {};
    }
    query.count['$gte'] = min;
  }
  if (!isNaN(max)) {
    if (!query.count) {
      query.count = {};
    }
    query.count['$lte'] = max;
  }
  return query;
}

export class StatController {
  /**
   * Gets all words for a particular verseList. Can be filtered to min and max occurrences using
   * `min` and `max` query params.
   */
  public static async getWords(req: Request<IGetWordStatsRequest, any, any, IGetWordsStatsQuery>, res: Response) {
    try {
      const query = buildQuery(req.query, 'word');

      const Stat = getStatModel(req.params.verseListId);

      const words = await Stat.find(query)
        .select('text count -_id')
        .sort({ 'references.verseIndex': 'asc', 'references.wordIndex': 'asc' })
        .exec();

      res.status(httpStatus.OK).json(words.map((w) => ({ text: w.text, count: w.count })));
    } catch (err) {
      console.log('e', err);
      internalServerError(err, req, res);
    }
  }

  /**
   * Gets full stats for words in a verseList. Paginated with a max number of words per request.
   * Paginate using the `start` and `end` query params.
   */
  public static async getWordStats(req: Request<IGetWordStatsRequest, any, any, IGetWordStatsQuery>, res: Response) {
    try {
      const start = +(req.query.start || 0);
      const end =
        typeof req.query.end === 'string' || typeof req.query.end === 'number' ? +req.query.end : start + MAX_STATS;
      if (end - start > MAX_STATS) {
        return res.status(httpStatus.BAD_REQUEST).json({
          errors: [
            {
              message: `Exceeded maximum of ${MAX_STATS} stats per request.`,
            },
          ],
        });
      }
      const query = buildQuery(req.query, 'word');

      const Stat = getStatModel(req.params.verseListId);

      const wordStats = await Stat.find({ ...query, sortOrder: { $gte: start, $lt: end } })
        .sort({ sortOrder: 'asc' })
        .exec();

      res.status(httpStatus.OK).json(wordStats);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  /**
   * Gets full stat information for a single word in a verseList.
   */
  public static async getSingleWordStat(req: Request<IGetSingleWordStatRequest>, res: Response) {
    try {
      const Stat = getStatModel(req.params.verseListId);

      const wordStats = await Stat.findOne({ type: 'word', text: req.params.word }).exec();

      res.status(httpStatus.OK).json(wordStats);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  /**
   * Gets all phrases for a particular verseList. Can be filtered to min and max occurrences using
   * `min` and `max` query params.
   */
  public static async getPhrases(req: Request<IGetPhraseStatsRequest, any, any, IGetPhrasesStatsQuery>, res: Response) {
    try {
      const query = buildQuery(req.query, 'phrase');

      const Stat = getStatModel(req.params.verseListId);

      const phrases = await Stat.find(query)
        .select('text count -_id')
        .sort({ 'references.verseIndex': 'asc', 'references.wordIndex': 'asc' })
        .exec();

      res.status(httpStatus.OK).json(phrases.map((p) => ({ text: p.text, count: p.count })));
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  /**
   * Gets full stats for phrases in a verseList. Paginated with a max number of phrases per request.
   * Paginate using the `start` and `end` query params.
   */
  public static async getPhraseStats(
    req: Request<IGetPhraseStatsRequest, any, any, IGetPhraseStatsQuery>,
    res: Response,
  ) {
    try {
      const start = +(req.query.start || 0);
      const end =
        typeof req.query.end === 'string' || typeof req.query.end === 'number' ? +req.query.end : start + MAX_STATS;
      if (end - start > MAX_STATS) {
        return res.status(httpStatus.BAD_REQUEST).json({
          errors: [
            {
              message: `Exceeded maximum of ${MAX_STATS} stats per request.`,
            },
          ],
        });
      }
      const query = buildQuery(req.query, 'phrase');

      const Stat = getStatModel(req.params.verseListId);

      const phraseStats = await Stat.find({ ...query, sortOrder: { $gte: start, $lt: end } })
        .sort({ sortOrder: 'asc' })
        .exec();

      res.status(httpStatus.OK).json(phraseStats);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  /**
   * Gets full stat information for a single phrase in a verseList.
   */
  public static async getSinglePhraseStat(req: Request<IGetSinglePhraseStatRequest>, res: Response) {
    try {
      const Stat = getStatModel(req.params.verseListId);

      const phraseStats = await Stat.findOne({ type: 'phrase', text: req.params.phrase }).exec();

      res.status(httpStatus.OK).json(phraseStats);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}
