const routes = (handler) => [
    {
        method: "POST",
        path: "/albums",
        handler: (request, h) => handler.postAlbumHandler(request, h),
    },
    {
        method: "GET",
        path: "/albums/{id}",
        handler: (request) => handler.getAlbumByIdHandler(request),
    },
    {
        method: "PUT",
        path: "/albums/{id}",
        handler: (request) => handler.putAlbumByIdHandler(request),
    },
    {
        method: "DELETE",
        path: "/albums/{id}",
        handler: (request) => handler.deleteAlbumByIdHandler(request),
    },
    {
        method: "POST",
        path: "/albums/{id}/covers",
        handler: (request, h) => handler.postAlbumCoverByIdHandler(request, h),
        options: {
            payload: {
                maxBytes: 512000,
                allow: "multipart/form-data",
                multipart: true,
                output: "stream",
            },
        },
    },
    {
        method: "POST",
        path: "/albums/{id}/likes",
        handler: (request, h) => handler.postLikeAlbumByIdHandler(request, h),
        options: {
            auth: "openmusicapi_jwt",
        },
    },
    {
        method: "DELETE",
        path: "/albums/{id}/likes",
        handler: (request) => handler.deleteLikeAlbumByIdHandler(request),
        options: {
            auth: "openmusicapi_jwt",
        },
    },
    {
        method: "GET",
        path: "/albums/{id}/likes",
        handler: (request, h) => handler.getLikeAlbumByIdHandler(request, h),
    },
];

module.exports = routes;
