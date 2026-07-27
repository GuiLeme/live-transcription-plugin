# Live Transcription Plugin automated tests

The unit suite uses Vitest for the extracted permission, locale, download, scroll,
and avatar helpers. The end-to-end suite uses Playwright against a running
BigBlueButton server and covers structural rendering, a single-user caption and
download flow, and multi-user caption synchronization.

## Setup

```bash
cp .env.template .env
npm ci
npm run build-bundle
npm run publish-plugin:dev
```

Set `BBB_URL`, `BBB_SECRET`, and `LOCAL_CONTAINER_NAME` in `.env`. The E2E suite
resolves the deployed manifest from `/plugins/live-transcription-plugin/dist/manifest.json`;
`LIVE_TRANSCRIPTION_PLUGIN_URL` can override that URL.

## Commands

```bash
npm run test:unit
npm run test:unit:coverage
npm test
```

The behavioral tests seed captions through BBB's public plugin caption commands.
Those commands flow through the client GraphQL mutation and Akka persistence path,
so the tests exercise the same subscription data consumed by the plugin without
depending on nondeterministic browser speech recognition.
