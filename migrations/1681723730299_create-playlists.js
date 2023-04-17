/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("playlists", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        name: {
            type: "TEXT",
            notNull: true,
        },
        owner: {
            type: "VARCHAR(50)",
            notNull: true,
        },
    });
    pgm.addConstraint("playlists", "fk_users.id_playlists.owner", "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE");

    pgm.createTable("playlist_songs", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        playlist_id: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        song_id: {
            type: "VARCHAR(50)",
            notNull: true,
        },
    });
    pgm.addConstraint("playlist_songs", "fk_playlists.id_playlist_songs.playlist_id", "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE");
    pgm.addConstraint("playlist_songs", "fk_songs.id_playlist_songs.song_id", "FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE");
};

exports.down = (pgm) => {
    pgm.dropTable("playlists");
    pgm.dropTable("playlist_songs");
};

