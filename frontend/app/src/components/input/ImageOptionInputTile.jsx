import React from 'react'

const ImageOptionInputTile = ({
    isSelected,
    imgUrl,
    onSelect,
}) => {
    const getColors = () => {
        if (isSelected) {
            return "border-primary border-2"
        }
        return "border-transparent"
    }
    return (

        <button className={`w-full flex items-center bg-slate-200/40 mb-4 border rounded-md overflow-hidden ${getColors()}`}
            onClick={onSelect}>
            <img src={imgUrl} className='w-full h-36 object-contain' />
        </button>
    )
}

export default ImageOptionInputTile