import { ParamsDictionary } from 'express-serve-static-core';
import Joi from 'joi';

/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     GetVersesTagsBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verses:
 *                 type: array
 *                 items:
 *                   type: number
 */

export interface IGetVersesTagsParams extends ParamsDictionary {
  verseListId: string;
}

export const GetVersesTagsParams = Joi.object<IGetVersesTagsParams>({
  verseListId: Joi.string(),
});

export interface IGetVersesTagsRequest {
  verses: number[];
}

export const GetVersesTagsRequest = Joi.object<IGetVersesTagsRequest>({
  verses: Joi.array().items(Joi.number()),
});

export interface IGetVersesTagsQuery extends qs.ParsedQs {
  start?: string;
  end?: string;
}

export const GetVersesTagsQuery = Joi.object<IGetVersesTagsQuery>({
  start: Joi.number().optional(),
  end: Joi.number().optional(),
});
