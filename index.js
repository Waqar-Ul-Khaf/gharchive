const bodyParser = require("body-parser");
const githubHelper = require('./helpers/githubHelper');
const mongoose = require('mongoose');
const cron = require('node-cron');
const request = require('request');
const cors = require('cors');
const AdmZip = require('adm-zip');
const axios = require('axios');
var rug = require('random-username-generator');
mongoose.connect('mongodb://localhost:27017/worky', {
    useNewUrlParser: true
});
const Url = require('url-parse');
const StreamArray = require('stream-json/streamers/StreamArray');
const jsonStream = StreamArray.withParser();
const path = require('path');
const { chain } = require('stream-chain');
const Verifier = require('stream-json/utils/Verifier');
const verifier = new Verifier();
const { parser } = require('stream-json');
const { pick } = require('stream-json/filters/Pick');
const { ignore } = require('stream-json/filters/Ignore');
const { streamValues } = require('stream-json/streamers/StreamValues');
const http = require('https');
const zlib = require('zlib');
const fs = require('fs');
const { gzip, ungzip } = require('node-gzip');
const campaignModel = require('./database/models/campaigns')(mongoose);
const githubUserModel = require('./database/models/githubUser')(mongoose);
const classGithubUserController = require('./controllers/githubuser');
const githubUserController = new classGithubUserController(githubUserModel);
const classCampaignController = require("./controllers/campaign");
const userModel = require('./database/models/users')(mongoose);
const classUserController = require('./controllers/user');
const profileModel = require('./database/models/profile')(mongoose);
const classProfileController = require('./controllers/profile');
const campaignController = new classCampaignController(campaignModel);
const profileController = new classProfileController(profileModel);
const userController = new classUserController(userModel, profileModel);
const eventModel = require('./database/models/events')(mongoose);
const classEventController = require('./controllers/event');
const eventController = new classEventController(eventModel);
const leaderModel = require('./database/models/leader')(mongoose);
const leaderHelper = require('./helpers/leaderBoard');
const classNodemailer = require('./helpers/nodemailer');
const classAxios = require('./helpers/axios');
const csv = require('csv-express')
const leaderHelperClass = new leaderHelper(profileModel, eventModel, leaderModel);
const express = require("express");
const app = express();

// configure dotenv

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json({
    limit: '50mb'
}));
const port = process.env.PORT || 8080;
app.listen(80, () => {
    console.log(`Server running on port ${port}`);
});
app.get("/leaderboard/:id", async (req, res, next) => {
    console.log("**** /leaderboard ****", req.params);
    const { id } = req.params;
    let leaders = [];
    try {
        leaders = await leaderHelperClass.getLeaders(id);
        res.send(leaders);
    } catch (err) {
        console.log("error getting leaders", err);
        res.send(err);
    }
});
app.post('/start', async (req, res, next) => {
    const DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/creativemorph/git-archives/2017-03');
    // const archiveUrl = 'https://data.gharchive.org/2017-03-03-0.json.gz';
    // const zippedArchive = await axios.get(archiveUrl);
    // const time = 0;
    const dates=['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
    let counter = 1;
    for(let j=13;j<=30;j++){
    for (let i = 0; i <= 23; i++) {
        let my_url = `https://data.gharchive.org/2017-03-${dates[j]}-${i}.json.gz`;
        let fileUrl = new Url(`https://data.gharchive.org/2017-03-${dates[j]}-${i}.json.gz`);
        var options = {
            host: fileUrl.host,
            path: fileUrl.pathname
        };
        const filename = fileUrl.pathname.split('/').pop();
        const file_path = path.join(DOWNLOAD_DIR, filename);
        // var file = fs.createWriteStream(file_path);
        // fs.unlinkSync(file_path)
        console.log('Host : ', fileUrl.hostname, 'path name ', fileUrl.pathname, "File name", filename, " -- ", DOWNLOAD_DIR);
        await request({ url: my_url, encoding: null })
            .pipe(fs.createWriteStream(file_path))
            .on('close', function () {
                console.log('File written!', counter);
                counter++;
            })
            .on('error', function (error) {
                console.log("Error", error);
            })
        
        // const response = await axios.get(my_url);
        // // console.log('File data', response);
        // file.write(response.data);
        // file.end();
        // await http.get(options, function (resp) {
        //     resp.on('data', function (data) {
        //         file.write(data);
        //     }).on('end', function () {
        //         file.end();
        //         console.log(filename + ' downloaded to ' + DOWNLOAD_DIR);
        //         delete (fileUrl)
        //     });
        // });
        await sleep(20000);
    }
}
    // fs.createReadStream('2015-01-01-0.json.gz').pipe(verifier)
    // console.log("Zipped Archive", zippedArchive);
    // const admZippedArchive = new AdmZip(zippedArchive);
    // const zipEntries = admZippedArchive.getEntries();
    // console.log("Zip Entries   ----->", zipEntries);
    // zipEntries.foreach((zipEntry) => {
    //     console.log(zipEntry.toString());
    // })
    // zipEntries.map(zip => {
    //     console.log('Zip is here ---->', zip)
    // })
    // const unzppedArchive = await ungzip(zippedArchive);

    // console.log('this is the result of hit', unzppedArchive.toString());
    // zlib.gunzip(zippedArchive, function (error, buff) {
    //     if (error != null) {
    //         console.log('Error While unzipping is ', error);
    //     }
    //     else {
    //         buff.toString('utf-8');
    //     }
    // });
    // call me for getting data and unzip 
    // getGzipped(archiveUrl, function (err, data) {
    //     if (err) {
    //         // console.log('Failed uncompressing ', err);
    //     }
    //     if (data) {
    //         for (let key in data) {
    //             console.log('---------->', data);
    //         }
    //     }
    // // });
    // const pipeline = chain([
    //     fs.createReadStream('2015-01-01-0.json.gz'),
    //     zlib.createGunzip(),
    //     parser(),
    //     // pick({ filter: 'type' }),
    //     // ignore({ filter: 'payload' }),
    //     streamValues(),
    //     data => {
    //         console.log("data ----------->", data);
    //         const value = data.value;
    //         // return value && value.department === 'accounting' ? data : null;
    //         return value;
    //     }
    // ]);
    // pipeline.on('data', (data) => {
    //     console.log('data ===>', data);
    // });
    // pipeline.on('end', () => console.log("Ended"))
    // verifier.on('error', error => console.log(error));

    // fs.createReadStream('2015-01-01-0.json.gz').pipe(verifier);
    // jsonStream.on('data', ({ key, value }) => {
    //     console.log(key, value);
    // });

    // jsonStream.on('end', () => {
    //     console.log('All done');
    // });
    // fs.createReadStream("2015-01-01-0.json.gz").pipe(jsonStream.input);
});
const wait=async (counter)=>{
    if(counter==24){
        return Promise.resolve('Done');
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
app.post("/training", async (req, res, next) => {
    const githelper = new githubHelper(null, "BASIC", null);
    let users = await githubUserController.getAllGithubUsers();
    users = users.slice(100, 200);
    users.forEach(async (user) => {
        // [{ name: 'giaffa86' }].forEach(async (user) => {
        const userData = await githelper.getUserProfileByUserName(user.name);
        if (userData) {
            try {
                const {
                    addedUser,
                    userFound } = await userController.createProfile({
                        name: userData.name,
                        email: userData.email,
                        activeProfiles: ['github'],
                        avatar: userData.avatar_url,
                        login: userData.login,
                        // campaigns: [_id],
                    });
                // console.log('Return object ', addedUser, "user found", userFound);
                if (userFound) {
                    console.log('user found updating events and network profile');
                    await profileController.updateNetworkProfile(addedUser._id, userData, 'github');
                    await githelper.getUserEvents(eventController, 'create');
                } else {
                    console.log('not found creating network profile and events');
                    await profileController.createNetworkProfile(addedUser._id, userData, 'github');
                    await githelper.getUserEvents(eventController, 'create');
                }
                // await profileController.createNetworkProfile(addedUser._id, userData, 'github');
                // await githelper.getUserEvents(eventController, 'create');

            }
            catch (e) {
                console.log('Error is --->', e);
            }
        }
        // console.log('For Loop Ended  *********  For loop ended ********* For loop ended  ***********  For loop ended')
        // console.log('Last user serverd');
    })
    console.log('For Loop Ended  *********  For loop ended ********* For loop ended  ***********  For loop ended')
    console.log('Last user serverd');
});
app.get('/exporttocsv', async (req, res, next) => {
    console.log("Export to Csv");
    const sampleGeneratedLeaders = [];
    for (let i = 0; i <= 30000; i++) {
        const username = rug.generate();
        const breakdown = {
            aggression: getRandomInt(0, 81180),
            commonUsage: getRandomInt(0, 1340),
            organized: getRandomInt(0, 13530),
            social: getRandomInt(0, 6980),
            basic: 1500
        };
        const score = breakdown.aggression + breakdown.commonUsage + breakdown.organized + breakdown.social + breakdown.basic;
        const sampleLeader = {
            username: username,
            score: score,
            // breakdown: JSON.stringify(breakdown),
            aggression: breakdown.aggression,
            commonUsage: breakdown.commonUsage,
            organized: breakdown.organized,
            social: breakdown.social,
            basic: breakdown.basic,
        }
        sampleGeneratedLeaders.push(sampleLeader);
    }
    const filename = 'leaders.csv';
    leaderModel.find({}).lean().exec({}, function (err, leaders) {
        if (err) res.send(err);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename=' + filename);
        const leadersAboveFifteen = leaders.filter((leader) => {
            return parseFloat(leader.score) > 1500;
        })
        // leadersAboveFifteen.map(leader => {
        //     const username = leader.username;
        //     const score = leader.score;
        //     const breakdown = leader.breakdown;
        //     sampleGeneratedLeaders.push({ username, score, breakdown })
        // })

        console.log("Leaders above 1500 basic score", leadersAboveFifteen.length);
        res.csv(leadersAboveFifteen, true);
    });
})
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
app.post("/gitlogin", async (req, res, next) => {
    console.log('**** /gitlogin ******', req.body);
    const code = req.body.code;
    const uuid = req.body.uuid;
    // invite code
    if (!code || !uuid) {
        res.status(422).send({
            error: "Insufficient parameters"
        });
    } else {
        (async function () {
            const axios = new classAxios();
            const response = await axios.post('POST', process.env.GITHUB_ACCESS_TOKEN_URL, {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code
            });
            const data = response.data;
            if (data.includes('access_token')) {
                console.log('IF: INCLUDES');
                const authToken = data.split('&')[0].split('=')[1];
                console.log('AUTH TOKEN ', authToken);
                const githelper = new githubHelper(authToken, 'TOKEN');
                const userdata = await githelper.getUserProfile();
                // console.log('USER DATA IN MAIN CODE: ', userdata);
                const campaign = await campaignController.getSingleCampaignByInvitationCode(uuid);
                console.log("CAMPAIGN ", campaign);
                if (campaign) {
                    const { _id } = campaign;
                    console.log('INVITE CODE ', _id);
                    const {
                        addedUser,
                        userFound
                    } = await userController.createProfile({
                        name: userdata.name,
                        email: userdata.email,
                        activeProfiles: ['github'],
                        avatar: userdata.avatar_url,
                        login: userdata.login,
                        campaigns: [_id],
                    });
                    await leaderHelperClass.createLeader(userdata.login, _id, userdata.email, userdata.avatar_url);
                    if (userFound) {
                        console.log('we come here!');
                        await profileController.updateNetworkProfile(addedUser._id, userdata, 'github');
                        await githelper.getUserEvents(eventController, 'create');
                    } else {
                        console.log('SHEEDAI UND');
                        await profileController.createNetworkProfile(addedUser._id, userdata, 'github');
                        await githelper.getUserEvents(eventController, 'create');
                    }
                }
            }
            else {
                console.log('ELSE CASE: TOKEN NOT FOUND OR EXPIRED ', data);
            }
        })();
        res.status(200).send();
    }
    //res.json([username, password]);
});
app.post("/adminlogin", async (req, res, next) => {
    console.log("******* /adminlogin ******", req.body)
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.status(422).send({
            error: "Insufficient parameters"
        });
    }
    const login = await userController.adminLogin(username, password);
    if (!login) {
        res.status(401).send({
            error: "Invalid credentials"
        });
        return;
    }
    res.status(200).json({
        adminId: login._id
    });
});
app.post("/campaigns", async (req, res, next) => {
    // console.log('*****  /campaigns post ********', req.body);
    // console.log('THIS LINE EXECUTED! ');
    // return res.status(200).send('kuchi kuchi ku');
    const campaignName = req.body.name;
    const id = req.body.id;
    const arr = req.body.recipients;
    if (!campaignName || !id || !arr) {
        res.status(422).send({
            error: "Insufficient parameters"
        });
    }

    try {
        const addedCampaign = await campaignController.createCampaign(campaignName, id);
        if (addedCampaign) {
            const {
                inviteCode
            } = addedCampaign;
            try {
                const nodemailer = new classNodemailer();
                const result = await nodemailer.sendEmail(arr, inviteCode);
                res.status(200).json({
                    addedCampaign
                })
            } catch (error) {
                res.status(500).send({
                    error: "Something bad happened while sending the emails"
                })
            }
        }
        else {
            console.log('campaign not created ');
        }
    } catch (error) {
        res.status(500).send({
            error: "Campaign couldn't created"
        });
    }
});
app.post("/getcampaigns", async (req, res, next) => {
    const id = req.body.id;
    if (!id) {
        res.status(422).send({
            error: "Insufficient parameters"
        });
    }
    const campaigns = await campaignController.getAllCampaignsByUserId(id);
    res.status(200).send(campaigns);
});
// cron.schedule('*/1 * * * *', async () => {
//     await leaderHelperClass.updateLeaders();
// });

function getGzipped(url, callback) {
    const buffer = [];
    http.get(url, function (res) {
        var gunzip = zlib.createGunzip();
        res.pipe(gunzip);
        gunzip.on('data', function (data) {
            buffer.push(data.toString())
        }).on("end", function () { // response and decompression complete, join the buffer and return
            callback(null, buffer.join(""));
        }).on("error", function (e) {
            callback(e);
        })
    }).on('error', function (e) {
        callback(e)
    });
}
