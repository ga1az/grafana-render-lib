# slack-grafana-render

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.20. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Usage

```typescript
const client = new SlackGrafanaRender({
  apiKey: "key",
  baseUrl: "http://localhost:3000",
});

const url = await client.render.dashboard({
  dashboardId: 1,
  orgId: 1,
  panelId: 1,
  from: "1723924217",
  to: "1723924220",
});
```
