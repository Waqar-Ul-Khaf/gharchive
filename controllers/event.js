class event {
    constructor(eventModel) {
        if (!eventModel && typeof eventModel !== 'function') {
            throw new Error('Insufficient Parameters Class event');
        }
        this.model = eventModel;
    }

    async createEvent(eventData) {
        if (!eventData && typeof eventData !== 'object') {
            throw new Error('Bad Parameters createEvent');
        }

        const createEvent = await this.model.create(eventData)
            .catch((err) => { throw new Error(err) });

        return createEvent;
    }
    async updateEvent(eventData) {
        if (!eventData && typeof eventData !== 'object') {
            throw new Error('Bad Parameters createEvent');
        }
        console.log("Event data", eventData.username);
        const createEvent = await this.model.findOneAndUpdate({ username: eventData.username }, {
            $set: {
                ...eventData
            }
        }, { new: true, upsert: true, }
            // , (err, doc) => {
            //     if (err) {
            //         console.log("Something wrong when updating event!");
            //     }
            //     else {
            //         console.log('doc  --------->', doc)
            //     }
            // }
        ).then(data => {
            // console.log("In then data is", data)
            console.log('Event update for user', eventData.username);
        }).catch(err => {
            console.log("Error is ", err);
        })
        return createEvent;
    }

}

module.exports = event;