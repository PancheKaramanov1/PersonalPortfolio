import { loadConfig } from './config.js';
import { createApp } from './app.js';

const config = loadConfig();
const app = createApp(config);

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
  console.log(`CORS origin: ${config.frontendUrl}`);
});
