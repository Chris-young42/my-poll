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
        setUser((pre) => ({
            ...pre,
            [key]: value
        }))
    }
    const onPollCreateOrDelete = (type = "create") => {
        const totalPollsCreated = user.totalPollsCreated || 0;
        updateUserStats("totalPollsCreated",
            type === "create" ? totalPollsCreated + 1 : totalPollsCreated - 1
        )
    }
    return (
        <UserContext.Provider value={{ user, updateUser, clearUser,onPollCreateOrDelete }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider