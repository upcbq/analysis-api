import { IReference, Reference } from '@shared/types/reference';
import Joi from 'joi';

/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     RemoveVerseListVersesRequest:
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
export const RemoveVerseListVersesRequest = Joi.object<IRemoveVerseListVersesRequest>({
  verses: Joi.array().items(Reference),
});

export interface IRemoveVerseListVersesRequest {
  verses: IReference[];
}
