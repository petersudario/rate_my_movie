/**
 * IMPORTANT: TMDb API Configuration
 * 
 * Before running this app, you MUST set up your TMDb API key.
 * 
 * Steps:
 * 1. Go to https://www.themoviedb.org/
 * 2. Create a free account
 * 3. Go to Settings -> API
 * 4. Request an API key (choose "Developer")
 * 5. Copy your API key (v3 auth)
 * 6. Replace 'YOUR_TMDB_API_KEY' below with your actual key
 * 
 * Example:
 * TMDB_API_KEY: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
 * 
 * See SETUP_GUIDE.md for detailed instructions.
 */

const TMDB_API_KEY = process.env.TMDB_API_KEY

if (!TMDB_API_KEY) {
    console.warn('Api key not set!!');
}

export const API_CONFIG = {
    TMDB_API_KEY,
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    TMDB_POSTER_SIZE: 'w500',
    TMDB_BACKDROP_SIZE: 'w780',
};

export const getImageUrl = (path: string | null, size: 'poster' | 'backdrop' = 'poster'): string => {
    if (!path) return '';
    const imageSize = size === 'poster' ? API_CONFIG.TMDB_POSTER_SIZE : API_CONFIG.TMDB_BACKDROP_SIZE;
    return `${API_CONFIG.TMDB_IMAGE_BASE_URL}/${imageSize}${path}`;
};
