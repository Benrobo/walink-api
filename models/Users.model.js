const { model, Schema } = require("mongoose")

const userSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, default: null },
    email: { type: String, unique: true },
    hash: { type: String },
    token: { type: String, default: "" }
}, { versionKey: false })

const User = model('User', userSchema);

module.exports = User;
