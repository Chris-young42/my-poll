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
            case "rating":
                processedOptions = [1, 2, 3, 4, 5].map((value) => ({ optionText: value.toString() }))
                break;
            case "yes/no":
                processedOptions = ["yes", "no"].map((option) => ({ optionText: option }))
                break;
            case "open-ended":
                processedOptions = [];
                break;
            case "image-based":
                if (!options || options.length < 2) {
                    return res.status(400).json({ message: "Image-based poll requires exactly two option" });
                }
                processedOptions = options.map((url) => ({ optionText: url }));
                break;

            default:
                return res.status(400).json({ message: "Invalid poll type" });
        }
        const newPoll = await Poll.create({ question, type, options: processedOptions, creator: creatorId });
        res.status(201).json(newPoll);
    } catch (error) {
        res.status(500).json({ message: "Error creating poll", error: error.message });

    }
}

exports.getAllPolls = async (req, res) => {
    const { type, creatorId, page = 1, limit = 10 } = req.query;
    const filter = {}
    const userId = req.user._id;
    if (type) { filter.type = type }
    if (creatorId) { filter.creator = creatorId }
    try {
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;
        const polls = await Poll.find(filter).populate('creator', "fullname username email profileImageUrl").populate({
            path: "responses.voterId",
            select: "username profileImageUrl fullname"
        }).skip(skip).limit(pageSize).sort({ createdAt: -1 })

        const updatedPolls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) =>
                voterId.equals(userId)
            )
            return {
                ...poll.toObject(),
                userHasVoted
            }
        })

        const totalPolls = await Poll.countDocuments(filter);
        const stats = await Poll.aggregate([
            {
                $group: {
                    _id: "$type",
                    totalPolls: { $sum: 1 }
                },
            },
            {
                $project: {
                    type: "$_id",
                    count: 1,
                    _id: 0,
                }
            }
        ])

        const allTypes = [
            { type: "single-choice", lable: "Single Choice" },
            { type: "rating", lable: "Rating" },
            { type: "yes/no", lable: "Yes/No" },
            { type: "image-based", lable: "Image Based" },
            { type: "open-ended", lable: "Open Ended" }
        ];
        const statsWithDefaults = allTypes.map((pollType) => {
            const stat = stats.find((item) => item.type === pollType.type);
            return {
                lable: pollType.lable,
                type: pollType.type,
                count: stat ? stat.count : 0,
            }
        }).sort((a, b) => b.count - a.count);
        res.status(200).json({
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPolls / pageSize),
            totalPolls,
            stats: statsWithDefaults
        });
    } catch (error) {
        res.status(500).json({ message: "Error getting polls", error: error.message });
    }
}

exports.getVotedPoll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const userId = req.user._id
    console.log(userId);



    try {
        const pageNumber = parseInt(page, 10)
        const pageSize = parseInt(limit, 10)
        const skip = (pageNumber - 1) * pageSize
        const polls = await Poll.find({ voters: userId })
            .populate('creator', 'fullName profileImageUrl username email')
            .populate({
                path: "responses.voterId",
                select: "username profileImageUrl fullName"
            }).skip(skip).limit(pageSize)
        const updatedPolls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId))
            return {
                ...poll.toObject(),
                userHasVoted
            }
        })

        const totalVotedPolls = await Poll.countDocuments({ voters: userId })
        res.status(200).json({
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalVotedPolls / pageSize),
            totalVotedPolls
        })
    } catch (error) {
        res.status(500).json({ message: "Error getting polls", error: error.message });
    }
}

exports.getPollById = async (req, res) => {
    const { id } = req.params
    try {
        const poll = await Poll.findById(id).populate("creator", "username email")
            .populate({
                path: "response.voterId",
                select: "username profileImageUrl fullName"
            })
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" })
        }
        res.status(200).json({ poll })

    } catch (error) {
        res.status(500).json({ message: "Error getting polls", error: error.message });
    }
}

exports.voteOnPoll = async (req, res) => {
    const { id } = req.params
    const { optionIndex, voterId, responseText } = req.body
    try {
        const poll = await Poll.findById(id)
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }
        if (poll.closed) {
            return res.status(400).json({ message: "Poll is closed" });
        }
        if (poll.voters.includes(voterId)) {
            return res.status(400).json({ message: "User has already voted" });
        }
        if (poll.type === "open-ended") {
            if (!responseText) {
                return res.status(400).json({ message: "Response text is required for open-ended poll" });
            }
            poll.responses.push({ voterId, responseText });
        } else {
            if (optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length) {
                return res.status(400).json({ message: "Invalid option index" });
            }
            poll.options[optionIndex].votes += 1;
        }
        poll.voters.push(voterId);
        await poll.save();
        res.status(200).json(poll);
    } catch (error) {
        res.status(500).json({ message: "Error getting polls", error: error.message });
    }
}

exports.closePoll = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    try {
        const poll = await Poll.findById(id)
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }
        if (poll.creator.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: Only the poll creator can close the poll" });
        }
        poll.closed = true
        await poll.save()
        res.status(200).json({ message: "Poll closed successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error getting polls", error: error.message });
    }
}


exports.bookmarkPoll = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isBookmarked = user.bookmarkedPolls.includes(id)
        if (isBookmarked) {
            user.bookmarkedPolls = user.bookmarkedPolls.filter((pollId) => pollId.toString() !== id)

            await user.save()
            return res.status(200).json({
                message: "Poll bookmarked successfully",
                bookmarkPoll: user.bookmarkedPolls
            })
        }

        user.bookmarkedPolls.push(id)
        await user.save()
        res.status(200).json({
            message: "Poll bookmarked successfully",
            bookmarkPoll: user.bookmarkedPolls
        })
    } catch (error) {
        res.status(500).json({ message: "Error getting polls", error: error.message });
    }
}

exports.getBookmarkedPolls = async (req, res) => {
    const userId = req.user.id
    try {
        const user = await User.findById(userId).populate({
            path: "bookmarkedPolls",
            populate: {
                path: "creator",
                select: "username username profileImageUrl"
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const bookmarkedPolls = user.bookmarkedPolls

        const updatedPolls = bookmarkedPolls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) =>
                voterId.equals(userId)
            )
            return {
                ...poll.toObject(),
                userHasVoted
            }

        })
        res.status(200).json({
            bookmarkedPolls: updatedPolls
        })
    } catch (error) {
        res.status(500).json({ message: "Error getting polls", error: error.message });
    }
}

exports.deletePoll = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    try {
        const poll = await Poll.findById(id)
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }
        if (poll.creator.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: Only the poll creator can delete the poll" });
        }
        await Poll.findByIdAndDelete(id)
        res.status(200).json({ message: "Poll deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error getting polls", error: error.message });
    }
}