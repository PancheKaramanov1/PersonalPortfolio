import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';

export function createAlbumsRouter({ albumService }) {
  const r = Router();

  r.get(
    '/',
    asyncHandler(async (req, res) => {
      const rows = await albumService.list();
      res.json(rows);
    })
  );

  r.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const row = await albumService.getById(req.params.id);
      if (!row) {
        res.status(404).json({ error: 'Album not found' });
        return;
      }
      res.json(row);
    })
  );

  r.post(
    '/',
    asyncHandler(async (req, res) => {
      const row = await albumService.create(req.body || {});
      res.status(201).json(row);
    })
  );

  r.patch(
    '/:id',
    asyncHandler(async (req, res) => {
      const row = await albumService.update(req.params.id, req.body || {});
      if (!row) {
        res.status(404).json({ error: 'Album not found' });
        return;
      }
      res.json(row);
    })
  );

  r.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      await albumService.remove(req.params.id);
      res.status(204).end();
    })
  );

  return r;
}
