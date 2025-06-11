
import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import SiderMenu from './SiderMenu'

const Navbar = ({activeMenu}) => {
    const [opensiderMenu, setOpensiderMenu] = useState(false)
  return (
    <div className='flex gap-5 boredr-b border-white-100 bg-slate-50/50 backdrop-blur-[2px] p-4 sticky top-0 z-30'>
      <button className='block text-black lg:hidden'
      onClick={()=>setOpensiderMenu(!opensiderMenu)}
      >
        {opensiderMenu ?(<HiOutlineX className='text-2xl'/>) :(<HiOutlineMenu className='text-2xl' />)} 
      </button>
        <h2 className='text-lg font-medium text-black'>traverl app</h2>
        {opensiderMenu && (
            <div className='fixed top-[61px] -ml-4 bg-white'>
                <SiderMenu activeMenu={activeMenu}/>
            </div>
        )}
    </div>
  )
}

export default Navbar