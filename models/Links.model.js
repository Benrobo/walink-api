const { model, Schema } = require("mongoose")

const linkSchema = new Schema({
    id: { type: String, unique: true },
    userId: { type: String},
    phonenumber: { type: String },
    active: { type: Boolean },
    createdAt: { type: String }
}, { versionKey: false })

const Link = model('Link', linkSchema);

module.exports = Link
