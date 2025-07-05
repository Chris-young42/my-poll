import React from 'react'
import OptionInputTile from '../input/OptionInputTile'

const PollContent = ({
    type,
    options,
    selectedOptionIndex,
    onOptionSelect,
    rating,
    onRatingChange,
    userResponse,
    onResponseChange,
}) => {
    switch (type) {
        case "single-choice":
        case "yes/no":
            return (
                <>
                    {options.map((option, index) => (
                        <OptionInputTile
                            key={option._id}
                            isSelected={selectedOptionIndex === index}
                            label={option.optionText || ""}
                            onSelect={() => onOptionSelect(index)}
                        />
                    ))}
                </>
            )

    }
}

export default PollContent