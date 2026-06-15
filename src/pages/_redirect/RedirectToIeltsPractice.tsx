import { Navigate } from 'react-router-dom'

/**
 * The standalone /ielts-writing and /ielts-speaking list pages have been merged
 * into the unified /ielts-practice hub (4 skills). These routes now redirect.
 */
const RedirectToIeltsPractice = () => <Navigate to="/ielts-practice" replace />

export default RedirectToIeltsPractice
