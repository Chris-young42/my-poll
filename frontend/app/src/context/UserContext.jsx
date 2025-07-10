import React, { createContext, useState } from 'react'
export const UserContext = createContext()
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const updateUser = (userData) => {
        setUser(userData)
    }
    const clearUser = () => {
        setUser(null)
    }
    const updateUserStats = (key, value) => {
        setUser((prev) => ({
            ...prev,
            [key]: value
        }))
    }

    const onUserVoted = () => {
        const totalPollsVotes = user.totalPollsVotes || 0
        updateUserStats("totalPollVotes", totalPollsVotes + 1)
    }
    const onPollCreateOrDelete = (type = "create") => {
        const totalPollsCreated = user.totalPollsCreated || 0;
        updateUserStats("totalPollsCreated",
            type === "create" ? totalPollsCreated + 1 : totalPollsCreated - 1
        )
    }
    const toggleBookmarkId = (id) => {
        const bookmarks = user.bookmarkedPolls || []
        const index = bookmarks.indexOf(id)
        if (index === -1) {
            setUser((prev) => ({
                ...prev,
                bookmarkedPolls: [...bookmarks, id],
                totalPollsBookmarked: prev.totalPollsBookmarked + 1
            }))
        } else {
            setUser((prev) => ({
                ...prev,
                bookmarkedPolls: bookmarks.filter((item) => item !== id),
                totalPollsBookmarked: prev.totalPollsBookmarked - 1
            }))
        }

    }
    return (
        <UserContext.Provider value={{ user, updateUser, clearUser, onPollCreateOrDelete, onUserVoted,toggleBookmarkId }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider