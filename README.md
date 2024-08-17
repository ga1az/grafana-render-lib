# slack-grafana-render

> IN DEVELOPMENT

To install dependencies:

```bash
bun install
```

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
