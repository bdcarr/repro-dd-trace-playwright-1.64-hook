// Runs the Playwright suite with dd-trace's CI Visibility loaded, against the fake agent.
// `--no-dd` runs the same suite without dd-trace, as a control.
const { spawn } = require('child_process');
const { startFakeAgent } = require('./fake-agent');

const PORT = 18126;
const withDd = !process.argv.includes('--no-dd');

(async () => {
  const agent = await startFakeAgent(PORT);

  const env = { ...process.env };
  if (withDd) {
    Object.assign(env, {
      NODE_OPTIONS: `${env.NODE_OPTIONS ?? ''} -r dd-trace/ci/init`.trim(),
      DD_CIVISIBILITY_ENABLED: 'true',
      DD_CIVISIBILITY_AGENTLESS_ENABLED: 'false',
      DD_TRACE_AGENT_URL: `http://127.0.0.1:${PORT}`,
      DD_INSTRUMENTATION_TELEMETRY_ENABLED: 'false',
    });
  }

  console.log(`Running with${withDd ? '' : 'out'} dd-trace\n`);
  const child = spawn('npx', ['playwright', 'test'], { stdio: 'inherit', env });
  child.on('exit', (code) => {
    agent.close();
    process.exit(code ?? 1);
  });
})();
