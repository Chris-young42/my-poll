import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import PollCard from '../../components/PollCard/PollCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import EmptyCard from '../../components/cards/EmptyCard'
import CREATE_ICON from '../../assets/images/cute.png'
import { useNavigate } from 'react-router-dom'


const PAGE_SIZE = 10
const VotedPolls = () => {
  useUserAuth()
  const navigate = useNavigate()
  const [votedPolls, setVotedPolls] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchAllPolls = async () => {
    if (loading) return
    setLoading(true)

    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.VOTED_POLLS)
      if (response.data?.polls?.length > 0) {
        setVotedPolls((prevPolls) => (
          [...prevPolls, ...response.data.polls]
        ))
        setHasMore(response.data?.polls?.length === PAGE_SIZE)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.log('wrong', error);

    } finally {
      setLoading(false)
    }
  }
  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1)
  }



  useEffect(() => {
    fetchAllPolls()
    return () => { }
  }, [page])
  return (
    <DashboardLayout activeMenu="Voted Polls">
      <div className='my-5 mx-auto'>
        <h2 className='text-xl font-medium text-black'>Voted Polls</h2>


        {votedPolls.length === 0 && !loading && (

          <EmptyCard
            imgSrc={CREATE_ICON}
            message={'welcome must create a poll'}
            btnText="Explore"
            onClick={() => navigate("/dashboard")}
          />
        )}

        <InfiniteScroll
          dataLength={votedPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className='info-text'>loading</h4>}
          endMessage={<p className='info-text'>null</p>}
        >
          {votedPolls.map((poll) => (<PollCard
            key={`dashboard_${poll._id}`}
            pollId={poll._id}
            question={poll.question}
            type={poll.type}
            options={poll.options}
            voters={poll.voters.length || 0}
            responses={poll.response || []}
            creatorProfileImg={poll.creator.profileImageUrl || null}
            creatorName={poll.creator.fullname}
            creatorUsername={poll.creator.username}
            userHasVoted={poll.userHasVoted || false}
            isPollClosed={poll.closed || false}
            createdAt={poll.createdAt || false}
            isMyPoll
          />))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  )
}

export default VotedPolls