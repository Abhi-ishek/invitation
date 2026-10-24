import { Router } from 'express';
import { getVideos, getVideoById } from '../controllers/videoController.js';

const router = Router();

router.get('/', getVideos);
router.get('/:id', getVideoById);

export default router;
