module.exports = function eventModel(mongoose) {
    const Schema = mongoose.Schema,
        schema = new Schema({
            type: {
                type: String,
                required: true
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            username: {
                type: String,
                required: true
            },
            dateCreated: {
                type: Date,
                default: new Date()
            },
            meta: {
                type: String,
                required: true
            }
        });
    return mongoose.model('Event', schema);
}