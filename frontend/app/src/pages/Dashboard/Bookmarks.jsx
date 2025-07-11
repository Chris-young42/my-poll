import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import PollCard from '../../components/PollCard/PollCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { UserContext } from '../../context/UserContext'
import EmptyCard from '../../components/cards/EmptyCard'
import CREATE_ICON from '../../assets/images/cute.png'
import { useNavigate } from 'react-router-dom'


const Bookmarks = () => {
  useUserAuth()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [bookmarkedPolls, setBookmarkPolls] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllPolls = async () => {
    if (loading) return
    setLoading(true)

    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.GET_BOOKMARKED)
      if (response.data?.bookmarkedPolls?.length > 0) {
        setBookmarkPolls((prevPolls) => (
          [...prevPolls, ...response.data.bookmarkedPolls]
        ))
      }
    } catch (error) {
      console.log('wrong', error);

    } finally {
      setLoading(false)
    }
  }





  useEffect(() => {
    fetchAllPolls()
    return () => { }
  }, [])
  return (
    <DashboardLayout activeMenu="Bookmarks">
      <div className='my-5 mx-auto'>
        <h2 className='text-xl font-medium text-black'>Bookmarked Polls</h2>


        {bookmarkedPolls.length === 0 && !loading && (

          <EmptyCard
            imgSrc={CREATE_ICON}
            message={'welcome must create a poll'}
            btnText="Explore"
            onClick={() => navigate("/dashboard")}
          />
        )}


        {bookmarkedPolls.map((poll) => {
          if (!user.bookmarkedPolls?.includes(poll._id)) return null

          return <PollCard
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
          />})}
      </div>
    </DashboardLayout>
  )
}

export default Bookmarks