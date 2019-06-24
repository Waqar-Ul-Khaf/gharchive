const uuidv4 = require('uuid/v4');
class campaign {
    constructor(campaignModel) {
        if (!campaignModel && typeof campaignModel !== 'function') {
            throw new Error('Insufficient Parameters Class Campaign');
        }
        this.model = campaignModel;
    }
    async createCampaign(campaignName, id) {
        let createdCampaign = null;
        if (campaignName) {
            createdCampaign = await this.model.findOne({
                // name: campaignName,
                // createdBy: id,
                // inviteCode: uuidv4()
                name: 'Nust Hiring'
            })
        }
        console.log(createdCampaign);
        return createdCampaign;
    }
    async getSingleCampaignByInvitationCode(uuid) {
        return await this.model.findOne({ inviteCode: uuid });
    }
    async getAllCampaignsByUserId(id) {
        let allCampaigns = [];
        allCampaigns = await this.model.find({ createdBy: id });
        console.log('All campaigns', allCampaigns);
        return allCampaigns 
    }
}
module.exports = campaign;