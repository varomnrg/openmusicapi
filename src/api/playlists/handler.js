class PlaylistsHandler {
    constructor(playlistsService, activitiesService, validator) {
        this._playlistsService = playlistsService;
        this._activitiesService = activitiesService;
        this._validator = validator;
    }
    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);
        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;
        const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });
        const response = h.response({
            status: "success",
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }
    async getPlaylistsHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._playlistsService.getPlaylists(credentialId);

        return {
            status: "success",
            data: {
                playlists,
            },
        };
    }
    async deletePlaylistByIdHandler(request, h) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        await this._playlistsService.deletePlaylistById(playlistId);
        return {
            status: "success",
            message: "Playlist berhasil dihapus",
        };
    }
    async postSongToPlaylistHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { songId } = request.payload;
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        await this._playlistsService.addSongToPlaylist(playlistId, songId);
        await this._activitiesService.addActivity(playlistId, songId, credentialId, "add");
        const response = h.response({
            status: "success",
            message: "Lagu berhasil ditambahkan ke playlist",
        });
        response.code(201);
        return response;
    }

    async getSongsFromPlaylistHandler(request, h) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        const playlist = await this._playlistsService.getSongsFromPlaylist(playlistId);
        return {
            status: "success",
            data: {
                playlist,
            },
        };
    }

    async deleteSongFromPlaylistHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { songId } = request.payload;
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        await this._playlistsService.deleteSongFromPlaylist(playlistId, songId);
        await this._activitiesService.addActivity(playlistId, songId, credentialId, "delete");
        return {
            status: "success",
            message: "Lagu berhasil dihapus dari playlist",
        };
    }

    async getActivitiesHandler(request, h) {
        this._validator.validateActivitiesPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        const activities = await this._activitiesService.getActivities(playlistId);
        return {
            status: "success",
            data: {
                playlistId,
                activities,
            },
        };
    }
}

module.exports = PlaylistsHandler;
