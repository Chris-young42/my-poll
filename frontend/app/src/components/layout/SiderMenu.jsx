import React, { useContext } from 'react'
import { SIDE_MENU_DATA } from '../../utils/data'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'

const SiderMenu = ({ activeMenu }) => {
    const {clearUser}=useContext(UserContext)
    const navigate = useNavigate()
    const handleClick = (route) => {
        if (route === 'logout') {
            handleLogout()
            return
        }
        navigate(route)
    }

    const handleLogout = () => {
        localStorage.clear()
        clearUser()
        navigate('/login')
    }
    return (
        <div className='w-64 h-[calc(100vh-61px)] bg-slate-50/50 border-r border-slate-100/70 p-5 sticky top-[61px] z-20'>
            {SIDE_MENU_DATA.map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] ${activeMenu == item.label ? 'text-white bg-primary' : ''} py-4 px-6 rounded-full mb-3`}
                    onClick={() => handleClick(item.path)}
                ><item.icon />{item.label}</button>
            ))}
        </div>
    )
}

export default SiderMenu