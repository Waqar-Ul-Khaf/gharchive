module.exports = function LeaderBoardModel(mongoose) {
    const Schema = mongoose.Schema,
    schema = new Schema({
        username: {
            type: String,
            required: true
        },
        score: {
            type: String,
            required: false
        },
        breakdown: {
            type: String,
            required: false
        },
        dateCreated: {
            type: Date,
            default: new Date()
        },
        campaignId: {
            type: Schema.Types.ObjectId,
            ref: 'Campaign'
        },
	email:{
	  type:String
	},
	avatar:{
	  type:String
	},
    });

    return mongoose.model('LeaderBoard', schema);
}
