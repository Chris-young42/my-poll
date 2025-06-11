const User = require('../models/User');
const Poll = require('../models/Poll');



exports.createPoll = async (req, res) => {
    
    const { question, type, options, creatorId } = req.body;

    if (!question || !type || !creatorId) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        let processedOptions = [];
        switch (type) {
            case 'single-choice':
                if (!options || options.length < 2) {
                    return res.status(400).json({ message: "Single-choice poll requires exactly two option" });
                }
                processedOptions = options.map(option => ({ optionText: option }));
                break;
            case "open-ended":
                processedOptions = [];
                break
            default:
                return res.status(400).json({ message: "Invalid poll type" });
        }
        const newPoll = await Poll.create({ question, type, options: processedOptions, creator: creatorId });
        res.status(201).json({ poll: newPoll });
    } catch (error) {
        res.status(500).json({ message: "Error creating poll", error: error.message });
    }
}