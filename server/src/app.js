import express from 'express';
import cors from 'cors';
import { loadConfig } from './config.js';
import { createSupabaseClient } from './db/supabaseClient.js';
import { createAlbumService } from './services/albumService.js';
import { createFavoritesService } from './services/favoritesService.js';
import { createAlbumsRouter } from './routes/albums.js';
import { createFavoritesRouter } from './routes/favorites.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export function createApp(config = loadConfig()) {
  const app = express();

  const supabase = createSupabaseClient({
    supabaseUrl: config.supabaseUrl,
    supabaseServiceKey: config.supabaseServiceKey,
  });

  const albumService = createAlbumService(supabase);
  const favoritesService = createFavoritesService(supabase);

  app.use(
    cors({
      origin: config.frontendUrl,
      credentials: true,
    })
  );
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({
      ok: true,
      supabase: Boolean(supabase),
      env: config.nodeEnv,
    });
  });

  app.use('/api/albums', createAlbumsRouter({ albumService }));
  app.use('/api/favorites', createFavoritesRouter({ favoritesService }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
