module.exports = function userModel(mongoose) {
    const Schema = mongoose.Schema,
        schema = new Schema({
            type: {
                type: String,
                enum: ['github', 'asana', 'trello'], // have to come through some constants
                required: true
            },
            meta: {
                type: String,
                required: true
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            dateCreated: {
                type: Date,
                default: new Date()
            },
            dateUpdated: {
                type: Date,
                default: new Date()
            },
            login: {
                type: String
            }
        });

    return mongoose.model('Profile', schema);
}