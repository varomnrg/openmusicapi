const mapAlbumToModel = ({ id, name, year, cover, created_at, updated_at }) => ({
    id,
    name,
    year,
    coverUrl: cover,
    createdAt: created_at,
    updatedAt: updated_at,
});

const mapSongToModel = ({ id, title, year, performer, genre, duration, albumId, created_at, updated_at }) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId,
    createdAt: created_at,
    updatedAt: updated_at,
});

module.exports = { mapAlbumToModel, mapSongToModel };
