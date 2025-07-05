import React from 'react'
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
const OptionInputTile = ({
    isSelected,
    label,
    onSelect,
}) => {

    const getColors = () => {
        if (isSelected) {
            return "text-white bg-primary border-sky-400"
        }
        return "text-black bg-slate-200/80 border-slate-200"
    }
    return (
        <button className={`w-full flex items-center gap-2 px-3 py-1 mb-4 border rounded-md ${getColors()}`}
            onClick={onSelect}
        >
            {isSelected ? (
                <FaCheckCircle className='text-lg text-white' />
            ) : (
                <MdOutlineRadioButtonUnchecked className='text-lg text-slate-400' />
            )}
            <span className='text-[13px]'>{label}</span>
        </button>
    )
}

export default OptionInputTile