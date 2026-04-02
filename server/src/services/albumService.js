import { normalizeAlbumRecord, parseYouTubeUrl } from '../utils/youtube.js';

const ALLOWED_FIELDS = new Set([
  'title', 'artist', 'year', 'genre', 'cover_url', 'rating',
  'top_track', 'note', 'youtube_url', 'youtube_embed_url',
  'youtube_type', 'youtube_title', 'featured_track',
  'source', 'source_url', 'favorite',
]);

function pickFields(body) {
  const out = {};
  for (const [k, v] of Object.entries(body)) {
    if (ALLOWED_FIELDS.has(k)) out[k] = v;
  }
  return out;
}

let detectedColumns = null;
async function getColumns(supabase) {
  if (detectedColumns) return detectedColumns;
  const { data } = await supabase.from('albums').select('*').limit(1);
  if (data?.length) {
    detectedColumns = new Set(Object.keys(data[0]));
  } else {
    detectedColumns = new Set(['id', 'title', 'artist', 'year', 'genre',
      'cover_url', 'rating', 'top_track', 'note', 'created_at',
      'youtube_embed_url', 'youtube_type']);
  }
  return detectedColumns;
}

function stripMissingColumns(row, cols) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    if (cols.has(k)) out[k] = v;
  }
  return out;
}

export function createAlbumService(supabase) {
  return {
    async list() {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('[albums] list:', error.message || error);
        return [];
      }
      return (data || []).map(normalizeAlbumRecord);
    },

    async getById(id) {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data ? normalizeAlbumRecord(data) : null;
    },

    async create(body) {
      if (!supabase) {
        const err = new Error('Database not configured');
        err.status = 503;
        throw err;
      }
      const row = pickFields(body);
      if (!row.title?.trim() || !row.artist?.trim()) {
        const err = new Error('title and artist are required');
        err.status = 400;
        throw err;
      }
      row.title = row.title.trim();
      row.artist = row.artist.trim();
      if (row.year != null) row.year = Number(row.year) || null;
      if (row.rating != null) row.rating = Number(row.rating) || null;
      if (row.favorite != null) row.favorite = Boolean(row.favorite);
      if (!row.source) row.source = 'manual';

      if (row.youtube_url && !row.youtube_embed_url) {
        const parsed = parseYouTubeUrl(row.youtube_url);
        if (parsed.embedUrl) {
          row.youtube_embed_url = parsed.embedUrl;
          if (!row.youtube_type) row.youtube_type = parsed.type || 'video';
        }
      }

      const cols = await getColumns(supabase);
      const safe = stripMissingColumns(row, cols);

      const { data, error } = await supabase
        .from('albums')
        .insert(safe)
        .select()
        .single();
      if (error) throw error;
      return normalizeAlbumRecord(data);
    },

    async update(id, body) {
      if (!supabase) {
        const err = new Error('Database not configured');
        err.status = 503;
        throw err;
      }
      const row = pickFields(body);
      if (Object.keys(row).length === 0) {
        const err = new Error('No valid fields to update');
        err.status = 400;
        throw err;
      }
      if (row.title != null) row.title = String(row.title).trim() || undefined;
      if (row.artist != null) row.artist = String(row.artist).trim() || undefined;
      if (row.year != null) row.year = Number(row.year) || null;
      if (row.rating != null) row.rating = Number(row.rating) || null;
      if (row.favorite != null) row.favorite = Boolean(row.favorite);

      const cols = await getColumns(supabase);
      const safe = stripMissingColumns(row, cols);

      const { data, error } = await supabase
        .from('albums')
        .update(safe)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data ? normalizeAlbumRecord(data) : null;
    },

    async remove(id) {
      if (!supabase) {
        const err = new Error('Database not configured');
        err.status = 503;
        throw err;
      }
      const { error } = await supabase.from('albums').delete().eq('id', id);
      if (error) throw error;
    },
  };
}
