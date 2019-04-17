class profile {

    constructor(profileModel) {
        if (!profileModel && typeof profileModel !== 'function') {
            throw new Error('Insufficient Parameters Class profile');
        }
        this.model = profileModel;
    }

    async createNetworkProfile(userId, jsonMeta, type) {
        if (!jsonMeta && typeof jsonMeta !== 'object') {
            throw new Error('Bad Parameters createNetworkProfile');
        }
        await this.model.create({
            type: type,
            meta: JSON.stringify(jsonMeta),
            user: userId,
            login: jsonMeta.login
        })
    }
    async updateNetworkProfile(userId, jsonMeta, type) {
        if (!jsonMeta && typeof jsonMeta !== 'object') {
            throw new Error('Bad Parameters createNetworkProfile');
        }

        await this.model.findOneAndUpdate({ login: jsonMeta.login }, {
            $set: {
                type: type,
                meta: JSON.stringify(jsonMeta),
            }
        }, { upsert: true }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating network profile!");
            }
            console.log("network profile updated", doc);
        });
    }
}

module.exports = profile;