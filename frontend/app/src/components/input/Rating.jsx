import React, { useState } from 'react'
import { HiMiniStar } from "react-icons/hi2";


const Rating = (
  { value = 0, onChange, readOnly = false, maxStars = 5, }
) => {
  const [hoverValue, setHoverValue] = useState(0)
  const handleCLick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating)
    }
  }
  const handleMouseEnter = (rating) => {
    if (!readOnly) {
      setHoverValue(rating)
    }
  }
  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0)
    }
  }
  return (
    <div className={`flex gap-2 ${readOnly ? "cursor-default" : "cursor-pointer"}`}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1
        return (<span key={index} className={`text-3xl transition-colors ${starValue <= (hoverValue || value) ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => handleCLick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
        >
          <HiMiniStar />
        </span>)
      })}

    </div>
  )
}

export default Rating