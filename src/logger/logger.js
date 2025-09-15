import pino from 'pino';

const logger = pino({
  browser: {
    serialize: true,
    asObject: true
  },
  level: 'info',
});

export default logger;
