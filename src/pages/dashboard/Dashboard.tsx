import { useAppSelector } from '@/store'
import StudentDashboard from './StudentDashboard'
import TeacherDashboard from './TeacherDashboard'
import { Navigate } from 'react-router-dom'

const Dashboard = () => {
  const role = useAppSelector((state) => state.auth.userInfo.role)

  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  if (role === 'TEACHER') {
    return <TeacherDashboard />
  }

  return <StudentDashboard />
}

export default Dashboard
