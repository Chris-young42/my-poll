import React from 'react'

const TreadingPolls = ({ stats }) => {
    return (
        <div className='bg-slate-100/50 rounded-lg mt-6 overflow-hidden sticky top-[80px] p-5 '>
            <h6 className='text-sm text-black font-medium'>
                TreadingPolls
            </h6>
            <div>
                {stats.map((item, index) => (
                    <div className='flex items-center justify-between rounded-lg cursor-pointer mb-1 px-3 py-2 hover:bg-slate-300/30' key={index}>
                        <p className='text-xs text-slate-900'>{item.label}</p>
                        <span className='txet-xs text-slate-600 rounded py-[2px] px-4'>
                            {item.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TreadingPolls