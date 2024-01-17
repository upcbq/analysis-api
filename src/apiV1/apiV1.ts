import { Router } from 'express';
import { tagRouter } from '@/apiV1/tag/tag.route';
import { tagInfoRouter } from '@/apiV1/tagInfo/tagInfo.route';
import { statRouter } from './stats/stat.route';

const router: Router = Router();

router.use('/tag', tagRouter);
router.use('/tagInfo', tagInfoRouter);
router.use('/stat', statRouter);

export default router;
