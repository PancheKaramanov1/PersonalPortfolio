const YT_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com', 'youtu.be']);

function isLikelyVideoId(id) {
  return typeof id === 'string' && /^[\w-]{11}$/.test(id);
}

function isLikelyListId(id) {
  return typeof id === 'string' && id.length >= 8 && /^[a-zA-Z0-9_-]+$/.test(id);
}

export function parseYouTubeUrl(raw) {
  if (!raw || typeof raw !== 'string') {
    return { embedUrl: null, type: null };
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return { embedUrl: null, type: null };
  }

  let url;
  try {
    url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`);
  } catch {
    return { embedUrl: null, type: null };
  }

  const host = url.hostname.replace(/^www\./, '');
  if (!YT_HOSTS.has(host) && host !== 'youtu.be') {
    return { embedUrl: null, type: null };
  }

  const listId = url.searchParams.get('list');
  const v = url.searchParams.get('v');

  if (host === 'youtu.be') {
    const videoId = url.pathname.split('/').filter(Boolean)[0];
    if (isLikelyVideoId(videoId)) {
      return { embedUrl: `https://www.youtube.com/embed/${videoId}`, type: 'video' };
    }
    return { embedUrl: null, type: null };
  }

  const shorts = url.pathname.match(/^\/shorts\/([\w-]{11})/);
  if (shorts && isLikelyVideoId(shorts[1])) {
    return { embedUrl: `https://www.youtube.com/embed/${shorts[1]}`, type: 'video' };
  }

  if (listId && isLikelyListId(listId)) {
    return {
      embedUrl: `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(listId)}`,
      type: 'playlist',
    };
  }

  if (v && isLikelyVideoId(v)) {
    return { embedUrl: `https://www.youtube.com/embed/${v}`, type: 'video' };
  }

  const embedMatch = url.pathname.match(/^\/embed\/([^/?]+)/);
  if (embedMatch) {
    const elist = url.searchParams.get('list');
    if (elist && isLikelyListId(elist)) {
      return {
        embedUrl: `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(elist)}`,
        type: 'playlist',
      };
    }
    const eid = embedMatch[1];
    if (eid === 'videoseries' && listId && isLikelyListId(listId)) {
      return {
        embedUrl: `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(listId)}`,
        type: 'playlist',
      };
    }
    if (isLikelyVideoId(eid)) {
      return { embedUrl: `https://www.youtube.com/embed/${eid}`, type: 'video' };
    }
  }

  return { embedUrl: null, type: null };
}

function isAllowedYouTubeEmbedUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return false;
  }
  try {
    const u = new URL(urlString);
    const host = u.hostname.replace(/^www\./, '');
    if (!YT_HOSTS.has(host)) {
      return false;
    }
    if (!u.pathname.startsWith('/embed')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function normalizeAlbumRecord(row) {
  if (!row || typeof row !== 'object') {
    return row;
  }
  const out = { ...row };

  let embed = (out.youtube_embed_url && String(out.youtube_embed_url).trim()) || '';
  let type = out.youtube_type || null;

  if (embed && !isAllowedYouTubeEmbedUrl(embed)) {
    const recovered = parseYouTubeUrl(embed);
    if (recovered.embedUrl) {
      embed = recovered.embedUrl;
      type = type || recovered.type || null;
    } else {
      embed = '';
    }
  }

  if (!embed) {
    const fromWatch = parseYouTubeUrl(out.youtube_url || '');
    embed = fromWatch.embedUrl || '';
    type = type || fromWatch.type || null;
  } else if (!type) {
    const parsed = parseYouTubeUrl(out.youtube_url || embed);
    type = parsed.type || (embed.includes('videoseries') ? 'playlist' : 'video');
  }

  out.youtube_embed_url = embed || null;
  out.youtube_type = embed ? type || 'video' : null;

  if (!out.source) {
    out.source = 'manual';
  }

  return out;
}
