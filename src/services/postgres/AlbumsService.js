const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapAlbumToModel } = require("../../utils");

class AlbumsService {
    constructor() {
        this._pool = new Pool();
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
}

module.exports = AlbumsService;
