const { Pool } = require("pg");
const { nanoid } = require("nanoid");

class ActivitiesService {
    constructor() {
        this._pool = new Pool();
    }

    async addActivity(playlistId, songId, userId, action) {
        const id = `activity-${nanoid(16)}`;
        const time = new Date().toISOString();
        const query = {
            text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
            values: [id, playlistId, songId, userId, action, time],
        };

        await this._pool.query(query);
    }

    async getActivities(playlistId) {
        const query = {
            text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
            FROM users
            INNER JOIN playlist_song_activities ON users.id = playlist_song_activities.user_id
            INNER JOIN songs ON songs.id = playlist_song_activities.song_id
            INNER JOIN playlists ON playlists.id = playlist_song_activities.playlist_id
            WHERE playlists.id = $1;`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }
}

module.exports = ActivitiesService;
