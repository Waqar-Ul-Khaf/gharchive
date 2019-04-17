module.exports = function githubUserModel(mongoose) {
    const Schema = mongoose.Schema,
        schema = new Schema({
            name: {
                type: String
            },
        });

    return mongoose.model('Githubuser', schema);
}