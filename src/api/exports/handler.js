class ExportsHandler {
    constructor(exportsService, playlistsService, validator) {
        this._exportsService = exportsService;
        this._playlistsService = playlistsService;
        this._validator = validator;
    }

    async postExportPlaylistHandler(request, h) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        this._validator.validateExportPlaylistPayload(request.payload);
        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        const message = {
            id: credentialId,
            targetEmail: request.payload.targetEmail,
        };
        await this._exportsService.sendMessage("export:playlists", JSON.stringify(message));
        const response = h.response({
            status: "success",
            message: "Permintaan Anda sedang kami proses",
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;
