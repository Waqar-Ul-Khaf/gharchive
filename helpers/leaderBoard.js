class leaderboard {

  constructor(profileModel, eventModel, leaderModel) {
    this.profileModel = profileModel;
    this.eventModel = eventModel;
    this.leaderModel = leaderModel;
  }
  async getLeaders(id) {
    let leaders = [];
    try {
      leaders = await this.leaderModel.find({
        campaignId: id
      });
      // console.log("Leaders ******", leaders);
    } catch (err) {
      console.log("Error getting Leaders", err);
    }
    return leaders;
  }
  // insert new leader with user name and campaign id only.
  async getAllLeaders() {
    const leaders = await this.leaderModel.find({});
    return leaders;
  }
  async createLeader(username, campaignId, email, avatar) {
    const createdLeaderRow = await this.leaderModel.create({
      username,
      campaignId,
      breakdown: '',
      score: '',
      email,
      avatar,
    });
    return createdLeaderRow;
  }
  async updateLeaders() {
    console.log('Update Leaders Called')
    const allProfiles = await this.profileModel.find({});
    for (let i = 0; i < allProfiles.length; i++) {
      const allEvents = await this.eventModel.find({
        username: JSON.parse(allProfiles[i].meta).login
      });
      await this.calculateScore(allProfiles[i], allEvents, JSON.parse(allProfiles[i].meta).login);
    }
  }
  async calculateScore(profile, events, username) {
    let initScore = 1500;
    const criteria = {
      aggression: 0,
      commonUsage: 0,
      organized: 0,
      social: 0
    };
    criteria.basic = initScore;
    for (let i = 0; i < events.length; i++) {
      switch (events[i].type) {
        case 'PushEvent':
          initScore = initScore + 15;
          criteria.aggression += 15;
          break;

        case 'CheckRunEvent':
          initScore = initScore + 1;
          criteria.commonUsage += 1;
          break;

        case 'CheckSuiteEvent':
          initScore = initScore + 1;
          criteria.commonUsage += 1;
          break;

        case 'CommitCommentEvent':
          initScore = initScore + 10;
          criteria.commonUsage += 10;
          break;

        case 'ContentReferenceEvent':
          initScore = initScore + 1;
          criteria.commonUsage += 1;
          break;

        case 'CreateEvent':
          initScore = initScore + 5;
          criteria.organized += 5;
          break;

        case 'DeleteEvent':
          initScore = initScore + 5;
          criteria.organized += 5;
          break;

        case 'ForkEvent':
          initScore = initScore + 5;
          criteria.organized += 5;
          break;

        case 'GistEvent': // not organized
          initScore = initScore + 5;
          criteria.social += 5;
          break;

        case 'InstallationEvent':
          initScore = initScore + 1;
          criteria.organized += 1;
          break;

        case 'IssueCommentEvent':
          initScore = initScore + 5;
          criteria.social += 5;
          break;

        case 'IssuesEvent':
          initScore = initScore + 5;
          criteria.organized += 5;
          break;

        case 'LabelEvent':
          initScore = initScore + 1;
          criteria.organized += 1;
          break;

        case 'ProjectCardEvent':
          initScore = initScore + 3;
          criteria.organized += 3;
          break;

        case 'ProjectColumnEvent':
          initScore = initScore + 3;
          criteria.organized += 3;
          break;

        case 'ProjectEvent':
          initScore = initScore + 3;
          criteria.organized += 3;
          break;

        case 'PublicEvent': //the best github, earns you 500 points
          initScore = initScore + 500;
          criteria.social += 500;
          break;

        case 'PullRequestEvent':
          initScore = initScore + 20;
          criteria.organized += 20;
          break;

        case 'PullRequestReviewEvent':
          initScore = initScore + 10;
          criteria.organized += 10;
          break;

        case 'PullRequestReviewCommentEvent':
          initScore = initScore + 10;
          criteria.social += 10;
          break;

        case 'ReleaseEvent':
          initScore = initScore + 10;
          criteria.social += 10;
          break;

        case 'RepositoryEvent':
          initScore = initScore + 5;
          criteria.organized += 5;
          break;

        case 'RepositoryImportEvent':
          initScore = initScore + 1;
          criteria.organized += 1;
          break;

        case 'RepositoryVulnerabilityAlertEvent':
          initScore = initScore + 1;
          criteria.organized += 1;
          break;

        case 'SecurityAdvisoryEvent':
          initScore = initScore + 1;
          criteria.organized += 1;
          break;

        default:
        // nothing for now
      }
    }
    console.log('*** Criteria man ***', criteria);
    const leader = {
      username: username,
      score: initScore,
      breakdown: JSON.stringify(criteria)
    }
    this.leaderModel.find({
      username: username
    }).exec((err, result) => {
      if (result.length > 0) {
        console.log("Found", result);
        result = result[0];
        if (result) {
          this.leaderModel.updateMany({
            username
          }, {
              score: leader.score,
              breakdown: leader.breakdown
            }, {
              multi: true
            }, (err, doc) => {
              if (err) {
                console.log("Something wrong when updating leader score!");
              } else {
                console.log('DOC ', doc);
              }
            })

        }
        // if (!(result.score == leader.score)) {
        //     this.leaderModel.updateMany({ username: username }, { $set: { score: leader.score, breakdown: leader.breakdown } }, (err, doc) => {
        //         if (err) {
        //         }
        //         console.log("Doc", doc);
        //     });
        // }
      } else {
        console.log("Not found writing new Leader", leader.username);
        this.leaderModel.create({
          username: leader.username,
          score: leader.score,
          breakdown: leader.breakdown
        });
      }
    })

    return;
  }
  calculate(playerRating, opponentRating, playerWin = true, k = 20) {
    const playerExpected = this.expected(playerRating, opponentRating);
    const ratingChange = parseInt(k * (!!playerWin - playerExpected), 10);

    return {
      playerRating: playerRating + ratingChange,
      opponentRating: opponentRating + ratingChange * -1
    };
  }
}
module.exports = leaderboard;
