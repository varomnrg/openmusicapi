const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapSongToModel } = require("../../utils");

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const durationInt = duration ? parseInt(duration, 10) : null;

        const query = {
            // eslint-disable-next-line quotes
            text: 'INSERT INTO songs (id, title, year, performer, genre, duration, "albumId", created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            values: [id, title, year, performer, genre, durationInt, albumId, createdAt, updatedAt],
        };
        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Lagu gagal ditambahkan");
        }

        return result.rows[0].id;
    }

    async getSongs(title, performer) {
        let query = "SELECT id, title, performer FROM songs";

        if (title && performer) {
            query += ` WHERE title ILIKE '%${title}%' AND performer ILIKE '%${performer}%'`;
        } else if (title) {
            query += ` WHERE title ILIKE '%${title}%'`;
        } else if (performer) {
            query += ` WHERE performer ILIKE '%${performer}%'`;
        }

        const result = await this._pool.query(query);
        return result.rows.map(mapSongToModel);
    }

    async getSongById(id) {
        const query = {
            text: "SELECT * FROM songs WHERE id = $1",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Lagu tidak ditemukan");
        }

        return result.rows.map(mapSongToModel)[0];
    }

    async editSongById(id, { title, year, genre, performer, duration = null, albumId = null }) {
        const updatedAt = new Date().toISOString();

        const query = {
            // eslint-disable-next-line quotes
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6, updated_at = $7 WHERE id = $8 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Gagal memperbaharui lagu, Id tidak ditemukan");
        }
    }

    async deleteSongById(id) {
        const query = {
            text: "DELETE FROM songs WHERE id = $1 RETURNING id",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Lagu gagal dihapus, Id tidak ditemukan");
        }
    }

    async verifySong(songId) {
        const query = {
            text: "SELECT * FROM songs WHERE id = $1",
            values: [songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Lagu tidak ditemukan");
        }
    }
}

module.exports = SongsService;
