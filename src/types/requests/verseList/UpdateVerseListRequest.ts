import Joi from 'joi';

/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     UpdateVerseListRequest:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               year:
 *                 type: number
 *               translation:
 *                 type: string
 *               division:
 *                 type: string
 *               organization:
 *                 type: string
 */

export interface IUpdateVerseListRequest {
  name?: string;
  year?: number;
  division?: string;
  organization?: string;
  translation?: string;
}

export const UpdateVerseListRequest = Joi.object<IUpdateVerseListRequest>({
  name: Joi.string(),
  year: Joi.number().min(1900).max(3000),
  division: Joi.string(),
  organization: Joi.string(),
  translation: Joi.string(),
});
