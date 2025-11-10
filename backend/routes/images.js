import express from 'express';
import { body, param } from 'express-validator';
import * as ctrl from '../controllers/imagesController.js';

const router = express.Router();

router.get('/', ctrl.listImages);
router.post('/pull', body('repository').isString().notEmpty(), body('version').optional().isString(), ctrl.pullImage);
router.delete('/:id', param('id').isString(), ctrl.removeImage);

export default router;
