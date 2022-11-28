import Joi from 'joi';

export interface ICreateVerseListRequest {
  name: string;
  year: number;
  verses: string[];
  division: string;
  translation: string;
  organization: string;
}

/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     CreateVerseListRequest:
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
 *               verses:
 *                 type: array
 *                 items:
 *                   type: string
 */

export const CreateVerseListRequest = Joi.object<ICreateVerseListRequest>({
  name: Joi.string(),
  year: Joi.number().min(1900).max(3000),
  verses: Joi.array().items(Joi.string()),
  division: Joi.string(),
  translation: Joi.string(),
  organization: Joi.string(),
});
