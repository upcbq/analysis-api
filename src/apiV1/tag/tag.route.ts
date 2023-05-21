import { Router } from 'express';
import { TagController } from './tag.controller';
import { validator } from '@shared/middleware/validator';
import { GetVerseTagsParams } from '@/types/requests/tag/getVerseTagsRequest';
import {
  GetVersesTagsParams,
  GetVersesTagsQuery,
  GetVersesTagsRequest,
} from '@/types/requests/tag/getVersesTagsRequest';

export const tagRouter: Router = Router();

/**
 * @swagger
 *
 * /v1/tag/verseList/{verseListId}/verse/{verseIndex}:
 *   get:
 *     tags:
 *       - Tag
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: verseListId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: verseIndex
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AutoTag'
 *
 * /v1/tag/verseList/{verseListId}/verses:
 *   post:
 *     tags:
 *       - Tag
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: verseListId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       $ref: '#/components/requestBodies/GetVersesTagsBody'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AutoTag'
 *
 * /v1/tag/verseList/{verseListId}:
 *   get:
 *     tags:
 *       - Tag
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
 *                 $ref: '#/components/schemas/AutoTag'
 */

// Get tags for a verse
tagRouter.get(
  '/verseList/:verseListId/verse/:verseIndex',
  validator.params(GetVerseTagsParams),
  TagController.getVerseTags,
);

// Get tags for several verses
tagRouter.post(
  '/verseList/:verseListId/verses',
  validator.params(GetVersesTagsParams),
  validator.body(GetVersesTagsRequest),
  TagController.getVersesTags,
);

// Get tags for all verses in a verseList
tagRouter.get(
  '/verseList/:verseListId',
  validator.params(GetVersesTagsParams),
  validator.query(GetVersesTagsQuery),
  TagController.getVerselistTags,
);
