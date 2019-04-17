module.exports = function userModel(mongoose) {
    const Schema = mongoose.Schema,
        schema = new Schema({
            name: {
                type: String
            },
            email: {
                type: String
            },
            activeProfiles: [{
                type: String,
                enum: ['github', 'asana', 'trello']
            }],
            dateCreated: {
                type: Date,
                default: new Date()
            },
            login: {
                type: String,
            },
            isAdmin: {
                type: Boolean,
                default: false
            },
            password: {
                type: String
            },
            username: {
                type: String
            },
            campaigns: [{
                type: Schema.Types.ObjectId,
                ref: 'Campaign',
            }]
        });

    return mongoose.model('User', schema);
}