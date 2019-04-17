const axios = require('axios');

class Axios {
    constructor() {};
    async post(method, url, data) {
        try {
            return await axios({
                url,
                method,
                data,
            });
        } catch (error) {
            return Promise.reject();
        }
    }
}
module.exports = Axios;