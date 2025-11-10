import Docker from 'dockerode';
import config from '../config/index.js';

const dockerOptions = {};
if (config.dockerSocket) dockerOptions.socketPath = config.dockerSocket;
if (config.dockerHost) dockerOptions.host = config.dockerHost;

const docker = new Docker(dockerOptions);

export async function listContainers(all = true) {
  return docker.listContainers({ all });
}

export async function createContainer({ Image, name, ExposedPorts, HostConfig }) {
  const container = await docker.createContainer({ Image, name, ExposedPorts, HostConfig });
  return container.id;
}

export async function startContainer(containerId) {
  const container = docker.getContainer(containerId);
  return container.start();
}

export async function stopContainer(containerId) {
  const container = docker.getContainer(containerId);
  return container.stop();
}

export async function restartContainer(containerId) {
  const container = docker.getContainer(containerId);
  return container.restart();
}

export async function removeContainer(containerId, options = { force: true }) {
  const container = docker.getContainer(containerId);
  return container.remove(options);
}

export async function getContainerDetails(containerId) {
  const container = docker.getContainer(containerId);
  const info = await container.inspect();
  return info;
}

export async function getContainerLogs(containerId, opts = { stdout: true, stderr: true, tail: 200 }) {
  const container = docker.getContainer(containerId);
  const logs = await container.logs(opts);
  // logs is a Buffer/stream - convert to string if Buffer
  if (Buffer.isBuffer(logs)) return logs.toString('utf8');
  return logs;
}

export async function listImages() {
  return docker.listImages();
}

export async function pullImage(repoTag, onProgress = () => {}) {
  // repoTag e.g. 'nginx:latest'
  return new Promise((resolve, reject) => {
    docker.pull(repoTag, (err, stream) => {
      if (err) return reject(err);
      docker.modem.followProgress(stream, onProgress, (err2, output) => {
        if (err2) return reject(err2);
        resolve(output);
      });
    });
  });
}

export async function removeImage(imageId, opts = {}) {
  const image = docker.getImage(imageId);
  return image.remove(opts);
}
