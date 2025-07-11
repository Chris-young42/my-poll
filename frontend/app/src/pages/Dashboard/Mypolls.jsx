import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import HeaderWithFilter from '../../components/layout/HeaderWithFilter'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import PollCard from '../../components/PollCard/PollCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { UserContext } from '../../context/UserContext'
import EmptyCard from '../../components/cards/EmptyCard'
import CREATE_ICON from '../../assets/images/cute.png'
import { useNavigate } from 'react-router-dom'


const PAGE_SIZE = 3
const MyPolls = () => {
  useUserAuth()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [allPolls, setAllPolls] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState("")

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return
    setLoading(true)

    try {
      const response = await axiosInstance.get(`${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&$limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`)
      if (response.data?.polls?.length > 0) {
        setAllPolls((prevPolls) => (
          overridePage === 1 ? response.data.polls : [...prevPolls, ...response.data.polls]
        ))
        setStats(response.data?.stats || [])
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
    setPage(1)
    fetchAllPolls(1)
    return () => { }
  }, [filterType,user])


  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls()
    }
    return () => { }
  }, [page])
  return (
    <DashboardLayout activeMenu="My Polls">
      <div className='my-5 mx-auto'>
        <HeaderWithFilter
          title="My Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />


        {allPolls.length === 0 && !loading && (

          <EmptyCard
            imgSrc={CREATE_ICON}
            message={'welcome'}
            btnText="Create Poll"
            onClick={()=>navigate("/create-poll")}
          />
        )}

        <InfiniteScroll
          dataLength={allPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className='info-text'>loading</h4>}
          endMessage={<p className='info-text'>null</p>}
        >
          {allPolls.map((poll) => (<PollCard
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

export default MyPolls