const Joi = require("joi");

const AlbumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().integer().min(1970).max(new Date().getFullYear()).required(),
});

const AlbumCoverSchema = Joi.object({
    "content-type": Joi.string().valid("image/apng", "image/avif", "image/gif", "image/jpeg", "image/png", "image/webp").required(),
}).unknown();

module.exports = { AlbumPayloadSchema, AlbumCoverSchema };
