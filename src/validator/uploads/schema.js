const Joi = require("joi");

const AlbumCoverSchema = Joi.object({
    "content-type": Joi.string().valid("image/apng", "image/avif", "image/gif", "image/jpeg", "image/png", "image/webp").required(),
}).unknown();

module.exports = { AlbumCoverSchema };
