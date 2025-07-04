export const BASE_URL = 'http://localhost:8000'

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getUser",
    UPDATE_PROFILE: "/api/v1/auth/update",
  },
  POLLS: {
    CREATE: "/api/v1/polls/create",
    GET_ALL: "/api/v1/polls/getAllPolls",
    GET_BY_ID: (pollId) => `/api/v1/polls/${pollId}`,
    VOTE: (pollId) => `/api/v1/polls/${pollId}/vote`,
    CLOSE: (pollId) => `/api/v1/polls/${pollId}/close`,
    BOOKMARK: (pollId) => `/api/v1/polls/${pollId}/bookmark`,
    GET_BOOKMARKED: "/api/v1/polls/user/bookmarked",
    VOTED_POLLS:"/api/v1/polls/votedPolls",
    DELETE:(pollId)=>`/api/v1/polls/${pollId}/delete`,
  },
  IMAGE: {
    UPDATE_IMAGE: "/api/v1/auth/upload-image",
  }
}
