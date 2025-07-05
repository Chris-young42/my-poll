import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useUserAuth()
  const navigate = useNavigate()
  const [allPolls, setAllPolls] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState("")
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto'>
        <HeaderWithFilter 
        title="Polls"
        filterType={filterType}
        setFilterType={setFilterType}
        />
      </div>
    </DashboardLayout>
  )
}

export default Home