import { validationResult } from 'express-validator';
import * as dockerService from '../services/dockerService.js';

export async function listImages(req, res, next) {
  try {
    const data = await dockerService.listImages();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function pullImage(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { repository, version } = req.body;
    const repoTag = `${repository}:${version || 'latest'}`;

    await dockerService.pullImage(repoTag, (evt) => {
      // could stream progress to clients via SSE or websockets
      // for now we ignore progress
    });

    res.status(201).json({ ok: true, repoTag });
  } catch (err) {
    next(err);
  }
}

export async function removeImage(req, res, next) {
  try {
    const { id } = req.params;
    await dockerService.removeImage(id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
