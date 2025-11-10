import express from 'express';
import containersRouter from './containers.js';
import imagesRouter from './images.js';

const router = express.Router();

router.use('/containers', containersRouter);
router.use('/images', imagesRouter);

export default router;
