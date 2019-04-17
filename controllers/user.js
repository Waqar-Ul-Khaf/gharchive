class user {
    constructor(userModel, profileModel) {
        if (!userModel && typeof userModel !== 'function') {
            throw new Error('Insufficient Parameters Class user');
        }
        this.model = userModel;
        this.profileModel = profileModel;
    }
    async createProfile(userdata) {
        let addedUser = null;
        let userFound = false;
        if (!userdata && typeof userdata !== 'object') {
            throw new Error('Bad Parameters createProfile');
        }
        try {
            var users = await this.model.find({});
        }
        catch (err) {
            console.log('err in finding profiles', err);
        }
        for (let i = 0; i < users.length; i++) {
            if (userdata.login == users[i].login) {
                userFound = true;
                addedUser = users[i];
                console.log("usr ", users[i], " exists already!");
                break;
            }
        }
        if (!userFound) {
            addedUser = await this.model.create(userdata)
            console.log(addedUser.login, " added in pool")
        }
        else {
            // const updatedUser = await this.model.findByIdAndUpdate(addedUser._id, {$push: {campaigns: userdata.campaigns[0]}});
            // console.log('UPDATED USER ', updatedUser);
            console.log("User exists already now you just need to update its evenets and score")
        }
        return { addedUser, userFound };
    }

    async adminLogin(username, password) {
        const foundAdmin = await this.model.findOne({
            username: username,
            password: password
        });
        // await this.model.create({username: 'qasim', password: 'qasimsalam'})
        return foundAdmin;
        // console.log(foundAdmin);
    }
}
module.exports = user;