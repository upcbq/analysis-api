import { Router } from 'express';
import { tagRouter } from '@/apiV1/tag/tag.route';
import { tagInfoRouter } from '@/apiV1/tagInfo/tagInfo.route';

const router: Router = Router();

router.use('/tag', tagRouter);
router.use('/tagInfo', tagInfoRouter);

export default router;
