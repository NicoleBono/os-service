let tracer: unknown = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
  const dd = require('dd-trace') as any;
  tracer = (dd.default ?? dd).init({
    service: 'os-service',
    env: process.env.NODE_ENV || 'production',
    version: process.env.APP_VERSION || '1.0.0',
    logInjection: true,
    runtimeMetrics: true,
  });
} catch {
  // dd-trace not available in this environment
}
export default tracer;
