const uuidv4 = require('uuid/v4');

module.exports = function eventModel(mongoose) {
    const Schema = mongoose.Schema,
        schema = new Schema({
            name: {
                type: String,
                required: true
            },
            inviteCode: {
                type: String,
                default: uuidv4()
            },
            createdBy: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            dateCreated: {
                type: Date,
                default: new Date()
            },
        });
    return mongoose.model('Campaign', schema);
}