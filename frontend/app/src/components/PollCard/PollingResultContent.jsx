import React from 'react'

const PollOptionVoterResult = ({ label, optionVotes, totalVotes }) => {
  const progress = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0
  return (
    <div className=''>
      <div className=''
        style={{ width: `${progress}` }}>
      </div>
      <span>
        {label}
        <span className='text-[11px] text-slate-500'>
          {progress}
        </span>
      </span>
    </div>
  )
}


const PollingResultContent = ({
  type, options, voters, response
}) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
    case "rating":
  }
  return (
    <>
      {
        options.map((option, index) = (
          <PollOptionVoterResult
            key={option._id}
            label={`${option.optionText} ${type === "rating" ? "Star" : ""}`}
            optionVotes={option.votes}
            totalVotes={voters || 0}
          />
        ))
      }
    </>
  )
}

export default PollingResultContent