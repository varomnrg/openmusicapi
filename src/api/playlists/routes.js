const routes = (handler) => [
    {
        method: "POST",
        path: "/playlists",
        handler: (request, h) => handler.postPlaylistHandler(request, h),
        options: {
            auth: "openmusicapi_jwt",
        },
    },
    {
        method: "GET",
        path: "/playlists",
        handler: (request) => handler.getPlaylistsHandler(request),
        options: {
            auth: "openmusicapi_jwt",
        },
    },
    {
        method: "DELETE",
        path: "/playlists/{id}",
        handler: (request) => handler.deletePlaylistByIdHandler(request),
        options: {
            auth: "openmusicapi_jwt",
        },
    },
    {
        method: "POST",
        path: "/playlists/{id}/songs",
        handler: (request, h) => handler.postSongToPlaylistHandler(request, h),
        options: {
            auth: "openmusicapi_jwt",
        },
    },
    {
        method: "GET",
        path: "/playlists/{id}/songs",
        handler: (request) => handler.getSongsFromPlaylistHandler(request),
        options: {
            auth: "openmusicapi_jwt",
        },
    },
    {
        method: "DELETE",
        path: "/playlists/{id}/songs",
        handler: (request) => handler.deleteSongFromPlaylistHandler(request),
        options: {
            auth: "openmusicapi_jwt",
        },
    },
    {
        method: "GET",
        path: "/playlists/{id}/activities",
        handler: (request) => handler.getActivitiesHandler(request),
        options: {
            auth: "openmusicapi_jwt",
        },
    },
];

module.exports = routes;
