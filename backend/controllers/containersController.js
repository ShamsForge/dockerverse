import { validationResult } from 'express-validator';
import * as dockerService from '../services/dockerService.js';
import * as portManager from '../services/portManager.js';

export async function list(req, res, next) {
  try {
    const data = await dockerService.listContainers(true);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, image, port } = req.body;
    const ExposedPorts = {};
    const HostConfig = { PortBindings: {} };
    if (port) {
      ExposedPorts[`${port}/tcp`] = {};
      HostConfig.PortBindings[`${port}/tcp`] = [{ HostPort: String(port) }];
    }

    const id = await dockerService.createContainer({ Image: image, name, ExposedPorts, HostConfig });
    await dockerService.startContainer(id);

    // Optionally reserve public port
    let publicPort = null;
    try {
      publicPort = portManager.reservePort();
    } catch (e) {
      // no-op
    }

    res.status(201).json({ id, publicPort });
  } catch (err) {
    next(err);
  }
}

export async function start(req, res, next) {
  try {
    const { id } = req.params;
    await dockerService.startContainer(id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function stop(req, res, next) {
  try {
    const { id } = req.params;
    await dockerService.stopContainer(id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function restart(req, res, next) {
  try {
    const { id } = req.params;
    await dockerService.restartContainer(id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await dockerService.removeContainer(id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function details(req, res, next) {
  try {
    const { id } = req.params;
    const info = await dockerService.getContainerDetails(id);
    res.json(info);
  } catch (err) {
    next(err);
  }
}

export async function logs(req, res, next) {
  try {
    const { id } = req.params;
    const tail = Number(req.query.tail || 200);
    const logs = await dockerService.getContainerLogs(id, { stdout: true, stderr: true, tail });
    res.type('text/plain').send(logs);
  } catch (err) {
    next(err);
  }
}
