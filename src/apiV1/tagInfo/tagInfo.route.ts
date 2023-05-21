import { Router } from 'express';
import { TagInfoController } from './tagInfo.controller';

export const tagInfoRouter: Router = Router();

/**
 * @swagger
 *
 * /v1/tagInfo:
 *   get:
 *     tags:
 *       - TagInfo
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/TagInfo'
 * /v1/tagInfo/style.css:
 *   get:
 *     tags:
 *       - TagInfo
 *     produces:
 *       - text/css
 *     responses:
 *       '200':
 *         content:
 *           text/css:
 */

// Get info for all tags
tagInfoRouter.get('/', TagInfoController.getAllTagInfo);
tagInfoRouter.get('/style.css', TagInfoController.getTagCss);
