class Githubuser {
    constructor(githubuserModel) {
        if (!githubuserModel && typeof githubuserModel !== 'function') {
            throw new Error('Insufficient Parameters Class Githubuser');
        }
        this.model = githubuserModel;
        // this.profileModel = profileModel;
    }
    async createGithubUser(name) {
        if (!name && typeof name == 'String') {
            throw new Error('Bad Parameters createGithubUser');
        }
        try {
            await this.model.create({
                name: name
            })
        }
        catch (e) {
            console.log("Mongoose githubuser coltroller create error");
        }

    }
    async getAllGithubUsers() {
        try {
            return await this.model.find({})
        }
        catch (e) {
            console.log('Some thing went wrong ', e);
        }
    }
}
module.exports = Githubuser;