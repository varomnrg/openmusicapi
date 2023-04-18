const Joi = require("joi");

const PlaylistPayloadSchema = Joi.object({
    name: Joi.string().required(),
});

const PlaylistSongPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});

const ActivitiesPayloadSchema = Joi.object({
    playlistId: Joi.string().required(),
    songId: Joi.string().required(),
    userId: Joi.string().required(),
    action: Joi.string().valid("add", "remove").required(),
});

module.exports = { PlaylistPayloadSchema, PlaylistSongPayloadSchema, ActivitiesPayloadSchema };
