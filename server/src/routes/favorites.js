import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';

export function createFavoritesRouter({ favoritesService }) {
  const r = Router();

  r.get(
    '/highlights',
    asyncHandler(async (req, res) => {
      const data = await favoritesService.highlights();
      res.json(data);
    })
  );

  return r;
}
