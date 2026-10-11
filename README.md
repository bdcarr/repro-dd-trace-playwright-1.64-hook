# dd-trace × Playwright 1.64: `Cannot read properties of undefined (reading 'file')`

With dd-trace's CI Visibility loaded (`-r dd-trace/ci/init`), every Playwright 1.64 test whose trace is kept fails with:

```
TypeError: Cannot read properties of undefined (reading 'file')
    at WorkerMain._runTest (.../dd-trace/packages/datadog-instrumentations/src/playwright.js:2673:5)
```

## Running

```sh
npm install
npm run repro        # with dd-trace: fails
npm run repro:no-dd  # without dd-trace: passes
```

`run.js` starts a fake agent and points dd-trace at it, otherwise dd-trace won't run.
