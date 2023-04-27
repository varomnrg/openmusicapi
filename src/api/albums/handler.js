class AlbumsHandler {
    constructor(service, storageService, validator) {
        this._service = service;
        this._storageService = storageService;
        this._validator = validator;
    }

    async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);

        const albumId = await this._service.addAlbum(request.payload);

        const response = h.response({
            status: "success",
            data: {
                albumId,
            },
        });

        response.code(201);

        return response;
    }

    async getAlbumByIdHandler(request) {
        const { id } = request.params;

        const album = await this._service.getAlbumById(id);

        return {
            status: "success",
            data: {
                album,
            },
        };
    }

    async putAlbumByIdHandler(request) {
        this._validator.validateAlbumPayload(request.payload);

        const { id } = request.params;

        await this._service.editAlbumById(id, request.payload);

        return {
            status: "success",
            message: "Album berhasil diperbaharui",
        };
    }

    async deleteAlbumByIdHandler(request) {
        const { id } = request.params;

        await this._service.deleteAlbumById(id);

        return {
            status: "success",
            message: "Album berhasil dihapus",
        };
    }

    async postAlbumCoverByIdHandler(request, h) {
        const { id } = request.params;
        const data = request.payload.cover;
        this._validator.validateAlbumCover(data.hapi.headers);
        const filename = await this._storageService.writeFile(data, data.hapi);
        const fileLink = `http://${process.env.HOST}:${process.env.PORT}/upload/albums/images/${filename}`;
        await this._service.uploadAlbumCover(id, fileLink);
        const response = h.response({
            status: "success",
            message: "Sampul berhasil diunggah",
        });
        response.code(201);
        return response;
    }

    async postLikeAlbumByIdHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._service.addAlbumLike(credentialId, albumId);

        const response = h.response({
            status: "success",
            message: "Like berhasil ditambahkan",
        });
        response.code(201);
        return response;
    }

    async deleteLikeAlbumByIdHandler(request) {
        const { id: albumId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._service.deleteAlbumLike(credentialId, albumId);
        return {
            status: "success",
            message: "Album berhasil di unlike",
        };
    }

    async getLikeAlbumByIdHandler(request, h) {
        const { id: albumId } = request.params;
        const [result, cache] = await this._service.getAlbumLikes(albumId);
        const response = h.response({
            status: "success",
            data: {
                likes: result,
            },
        });
        response.code(200);
        if (cache) {
            response.header("X-Data-Source", "cache");
        }

        return response;
    }
}

module.exports = AlbumsHandler;
