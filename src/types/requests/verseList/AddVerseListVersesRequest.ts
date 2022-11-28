import { IReference, Reference } from '@shared/types/reference';
import Joi from 'joi';

/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     AddVerseListVersesRequest:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verses:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Reference'
 */

export const AddVerseListVersesRequest = Joi.object<IAddVerseListVersesRequest>({
  verses: Joi.array().items(Reference),
});

export interface IAddVerseListVersesRequest {
  verses: IReference[];
}
