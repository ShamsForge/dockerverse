import express from 'express';
import { body, param } from 'express-validator';
import * as ctrl from '../controllers/containersController.js';

const router = express.Router();

router.get('/', ctrl.list);

router.post('/'
  , body('name').isString().trim().notEmpty()
  , body('image').isString().trim().notEmpty()
  , body('port').optional().isInt({ min: 1, max: 65535 })
  , ctrl.create
);

router.post('/:id/start', param('id').isString(), ctrl.start);
router.post('/:id/stop', param('id').isString(), ctrl.stop);
router.post('/:id/restart', param('id').isString(), ctrl.restart);
router.delete('/:id', param('id').isString(), ctrl.remove);
router.get('/:id', param('id').isString(), ctrl.details);
router.get('/:id/logs', param('id').isString(), ctrl.logs);

export default router;
