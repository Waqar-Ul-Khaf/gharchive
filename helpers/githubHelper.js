const baseHelper = require('../helpers/basehelper');
const Octokit = require('@octokit/rest').plugin(require('@octokit/plugin-throttling'));

const USERPASSAUTH = require('../constants/constants');

class githubHelper extends baseHelper {
    constructor(token, authtype, authData) {
        super();
        if (!authtype) {
            throw new Error('Insufficient Parameters');
        }
        this.token = token;
        this.authenticateUser(token, authtype, authData);
    }

    authenticateUser(token, authtype) {
        switch (authtype) {
            case USERPASSAUTH:
                // let github = new Octokit({
                //     auth: {
                //         username: authData.username,
                //         password: authData.password,
                //         async on2fa() {
                //             // example: ask the user
                //             // handle 2FA
                //             // console.log('User profile is using 2FA');
                //         }
                //     }
                // })
                // this.github = github;
                // break;
                this.github = null;
                break;
            case "TOKEN":
                this.github = new Octokit({
                    auth: `token ${token}`
                })

                break;
            case "USERNAME":
                let github = new Octokit({
                    username: authData.username
                })
                this.github = github;
                break;
            case "BASIC":
                this.github = new Octokit({
                    auth: 'token ac8dcbe4312859a36237a08e84b5d068bb10b3c3',
                    throttle: {
                        onRateLimit: (retryAfter, options) => {
                            octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`)

                            if (options.request.retryCount === 0) { // only retries once
                                console.log(`Retrying after ${retryAfter} seconds!`)
                                return true
                            }
                        },
                        onAbuseLimit: (retryAfter, options) => {
                            // does not retry, only logs a warning
                            octokit.log.warn(`Abuse detected for request ${options.method} ${options.url}`)
                        }
                    }
                });
                break;
            default:
                this.github = null;
                break;

        }
    }

    async getUserProfile() {
        if (!this.github) {
            throw new Error('Github not initialized');
        }
        const result = await this.github.users.getAuthenticated({})
        // console.log('GET USER PROFILE DATA GITHUB INSIDE ', result);
        this.githubUser = result.data;
        return result.data;
    }
    async getUserProfileByUserName(username) {
        if (!this.github) {
            throw new Error('Github not initialized');
        }
        const result = await this.github.users.getByUsername({ username })
        this.githubUser = result.data;
        return result.data;
    }
    async getUserEvents(eventController, operation) {
        console.log('Get User events for ', this.githubUser.login);
        if (!this.github) {
            throw new Error('Github not initialized');
        }
        const username = this.githubUser.login;
        let page = 1;
        while (true) {
            try {
                var result = await this.github.activity.listEventsForUser(
                    { username, per_page: 50, page: page }).catch((err) => {
                        console.log('******', err);
                    })
            } catch (e) {
                console.log("Error ------------------------------------------>", e);
            }
            console.log("Length of data", result.data.length);
            if (!result || result.data.length <= 0) {
                break;
            }
            if (result.data.length > 0) {
                for (let i = 0; i < result.data.length; i++) {
                    if (operation === 'create') {
                        console.log('Creating event')
                        await eventController.createEvent(
                            { type: result.data[i].type, username: username, meta: JSON.stringify(result.data) })
                    }
                    else if (operation === 'update') {
                        console.log('Updating events')
                        await eventController.updateEvent(
                            { type: result.data[i].type, username: username, meta: JSON.stringify(result.data) })
                    }
                }
            }
            page++;
        }

        return true;
    }
}

module.exports = githubHelper;