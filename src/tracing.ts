import tracer from 'dd-trace';
tracer.init({
  service: 'os-service',
  env: process.env.NODE_ENV || 'production',
  version: process.env.APP_VERSION || '1.0.0',
  logInjection: true,
  runtimeMetrics: true,
});
export default tracer;
