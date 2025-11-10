import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3001,
  dockerSocket: process.env.DOCKER_SOCKET || null,
  dockerHost: process.env.DOCKER_HOST || null,
  baseDomain: process.env.BASE_DOMAIN || 'localhost',
  publicPortStart: parseInt(process.env.PUBLIC_PORT_START || '8000', 10),
  publicPortEnd: parseInt(process.env.PUBLIC_PORT_END || '8999', 10),
  adminToken: process.env.ADMIN_TOKEN || null,
};
