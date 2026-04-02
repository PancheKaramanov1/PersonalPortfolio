import { normalizeAlbumRecord } from '../utils/youtube.js';

export function createFavoritesService(supabase) {
  return {
    async highlights() {
      if (!supabase) {
        return { albums: [] };
      }

      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('rating', { ascending: false })
        .limit(4);

      if (error) {
        console.warn('[highlights] albums:', error.message || error);
      }

      const albums = error ? [] : (data || []).map(normalizeAlbumRecord);
      return { albums };
    },
  };
}
