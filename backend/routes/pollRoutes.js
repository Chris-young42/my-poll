const express = require('express');
const { protect } = require('../middleware/authMiddleware')
const { createPoll, getAllPolls, getVotedPoll, getPollById, voteOnPoll, closePoll, bookmarkPoll, getBookmarkedPolls, deletePoll } = require('../controllers/pollController')
const router = express.Router();
router.post('/create', protect, createPoll)
router.get("/getAllPolls", protect, getAllPolls)
router.get("/votedPolls", protect, getVotedPoll)
router.get("/:id", protect, getPollById)
router.post("/:id/vote", protect, voteOnPoll)
router.post("/:id/close", protect, closePoll)
router.post("/:id/bookmark", protect, bookmarkPoll)
router.get("/user/bookmarked", protect, getBookmarkedPolls)
router.delete("/delete/:id", protect, deletePoll)



module.exports = router; 