import { Router } from 'express';
import { StatController } from './stat.controller';
import { validator } from '@shared/middleware/validator';
import { GetSingleWordStatsParams, GetWordStatsParams, GetWordStatsQuery, GetWordsStatsQuery } from '@/types/requests/stats/getWordStatsRequest';
import { GetPhraseStatsParams, GetPhraseStatsQuery, GetPhrasesStatsQuery, GetSinglePhraseStatsParams } from '@/types/requests/stats/getPhraseStatsRequest';

export const statRouter: Router = Router();

/**
 * @swagger
 *
 * /v1/stat/verseList/{verseListId}/words:
 *   get:
 *     tags:
 *       - Stat
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: verseListId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: min
 *         type: number
 *       - in: query
 *         name: max
 *         type: number
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LiteStat'
 */

// Get all words for which you can get stats
statRouter.get(
  '/verseList/:verseListId/words',
  validator.params(GetWordStatsParams),
  validator.query(GetWordsStatsQuery),
  StatController.getWords,
);

/**
 * @swagger
 *
 * /v1/stat/verseList/{verseListId}/word:
 *   get:
 *     tags:
 *       - Stat
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: verseListId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: start
 *         type: number
 *       - in: query
 *         name: end
 *         type: number
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stat'
 */

// Get word stats for a verseList
statRouter.get(
  '/verseList/:verseListId/word',
  validator.params(GetWordStatsParams),
  validator.query(GetWordStatsQuery),
  StatController.getWordStats,
);

/**
 * @swagger
 *
 * /v1/stat/verseList/{verseListId}/stats/{word}:
 *   get:
 *     tags:
 *       - Stat
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: verseListId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: start
 *         type: number
 *       - in: query
 *         name: end
 *         type: number
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Stat'
 */

// Get stats for a particular word
statRouter.get(
  '/verseList/:verseListId/word/:word',
  validator.params(GetSingleWordStatsParams),
  StatController.getSingleWordStat,
);

/**
 * @swagger
 *
 * /v1/stat/verseList/{verseListId}/phrases:
 *   get:
 *     tags:
 *       - Stat
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: verseListId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: min
 *         type: number
 *       - in: query
 *         name: max
 *         type: number
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LiteStat'
 */

// Get all phrases for which you can get stats
statRouter.get(
  '/verseList/:verseListId/phrases',
  validator.params(GetPhraseStatsParams),
  validator.query(GetPhrasesStatsQuery),
  StatController.getPhrases,
);

/**
 * @swagger
 *
 * /v1/stat/verseList/{verseListId}/phrase:
 *   get:
 *     tags:
 *       - Stat
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: verseListId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: start
 *         type: number
 *       - in: query
 *         name: end
 *         type: number
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stat'
 */

// Get phrase stats for a verseList
statRouter.get(
  '/verseList/:verseListId/phrase',
  validator.params(GetPhraseStatsParams),
  validator.query(GetPhraseStatsQuery),
  StatController.getPhraseStats,
);

/**
 * @swagger
 *
 * /v1/stat/verseList/{verseListId}/phrase/{phrase}:
 *   get:
 *     tags:
 *       - Stat
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: verseListId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: start
 *         type: number
 *       - in: query
 *         name: end
 *         type: number
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Stat'
 */

// Get stats for a particular word
statRouter.get(
  '/verseList/:verseListId/phrase/:phrase',
  validator.params(GetSinglePhraseStatsParams),
  StatController.getSinglePhraseStat,
);