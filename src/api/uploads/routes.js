const path = require("path");

const routes = () => [
    {
        method: "GET",
        path: "/upload/albums/{param*}",
        handler: {
            directory: {
                path: path.resolve(__dirname, "../albums/file"),
            },
        },
    },
];

module.exports = routes;
