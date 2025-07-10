import React, { useState } from 'react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'

const PollActions = ({
    toggleBookmark,
    isVotedComplete,
    inputCaptured,
    onVoteSubmit,
    isMyPoll,
    pollClosed,
    onClosePoll,
    onDelete,
    isBookmarked
}) => {
    const [loading, setLoading] = useState(false)

    const handleVoteClick = async () => {
        setLoading(true)
        try {
            await onVoteSubmit()
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='flex items-center gap-4'>
            {(isVotedComplete || pollClosed) && (
                <div className='text-[11px] font-medium text-slate-600 bg-sky-700/10 px-3 py-1 rounded-md'>
                    {pollClosed ? "Closed" : "Voted"}
                </div>
            )}
            {isMyPoll && !pollClosed && (
                <button className='btn-small text-orange-500 bg-orange-500/20 hover:bg-orange-500 hover:text-white hover:border-organge-100'

                    onClick={onClosePoll}
                    disabled={loading}
                >close</button>
            )}
            {isMyPoll && (
                <button
                    className='btn-small text-red-500 bg-red-500/20 hover:bg-red-500 hover:text-slate-100'
                    onClick={onDelete}
                >
                    Delete
                </button>
            )}
                < button className='icon-btn' onClick={toggleBookmark}>
            {isBookmarked ? (<FaBookmark className="text-primary" />) : (
                <FaRegBookmark />
            )}
        </button>
            {
        inputCaptured && !isVotedComplete && (
            <button
                className='btn-small ml-auto'
                onClick={handleVoteClick}
                disabled={loading}
            >
                {loading ? "Submitting..." : "Submit"}
            </button>

        )

    }
        </div >
    )
}

export default PollActions