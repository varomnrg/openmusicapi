const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapAlbumToModel } = require("../../utils");

class AlbumsService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;
        const createdAt = new Date().toISOString();

        const query = {
            text: "INSERT INTO albums (id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $4) RETURNING id",
            values: [id, name, year, createdAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Album gagal ditambahkan");
        }

        return result.rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: "SELECT * FROM albums WHERE id = $1",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Album tidak ditemukan");
        }

        const res = { ...result.rows.map(mapAlbumToModel)[0] };

        const querySong = {
            // eslint-disable-next-line quotes
            text: 'SELECT * FROM songs WHERE "albumId" = $1',
            values: [res.id],
        };
        const resultSong = await this._pool.query(querySong);

        return { ...res, songs: resultSong.rows };
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
            values: [name, year, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Gagal memperbaharui album, Id tidak ditemukan");
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: "DELETE FROM albums WHERE id = $1 RETURNING id",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Album gagal dihapus, Id tidak ditemukan");
        }
    }

    async uploadAlbumCover(id, filename) {
        const query = {
            text: "UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id",
            values: [filename, id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Gagal memperbaharui album, Id tidak ditemukan");
        }
    }

    async verifyAlbum(albumId) {
        const query = {
            text: "SELECT * FROM albums WHERE id = $1",
            values: [albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Album tidak ditemukan");
        }

        return true;
    }

    async verifyAlbumLike(id, albumId) {
        const query = {
            text: "SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
            values: [id, albumId],
        };

        const result = await this._pool.query(query);

        if (result.rowCount) {
            throw new InvariantError("Gagal menambahkan like, user sudah like album ini");
        }

        return true;
    }

    async addAlbumLike(userId, albumId) {
        const id = `like-${nanoid(16)}`;
        await this.verifyAlbumLike(userId, albumId);
        await this.verifyAlbum(albumId);
        const query = {
            text: "INSERT INTO user_album_likes (id, user_id, album_id) VALUES($1, $2, $3) RETURNING id",
            values: [id, userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows) {
            throw new InvariantError("Like gagal ditambahkan");
        }

        await this._cacheService.delete(`albumsLike:${albumId}`);

        return result.rows[0].id;
    }

    async deleteAlbumLike(userId, albumId) {
        const query = {
            text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Like gagal dihapus");
        }

        await this._cacheService.delete(`albumsLike:${albumId}`);
    }

    async getAlbumLikes(albumId) {
        try {
            const result = await this._cacheService.get(`albumsLike:${albumId}`);
            return [JSON.parse(result), true];
        } catch (error) {
            const query = {
                text: "SELECT * FROM user_album_likes WHERE album_id = $1",
                values: [albumId],
            };

            const result = await this._pool.query(query);

            if (!result.rowCount) {
                throw new NotFoundError("Like tidak ditemukan");
            }
            await this._cacheService.set(`albumsLike:${albumId}`, JSON.stringify(result.rowCount));

            return [result.rowCount, false];
        }
    }
}

module.exports = AlbumsService;
