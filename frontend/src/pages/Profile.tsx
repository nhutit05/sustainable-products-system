import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()
  const handleSignOut = () => {
    const confirmed = window.confirm('Are you sure you want to sign out?')
    if (confirmed) {
      // Perform sign out logic here (e.g., clear user session, redirect to login page)
      console.log('User signed out')
      localStorage.removeItem('token')
      navigate('/login')
    }
  }
  return (
    <div className="profile-page mt-12 p-4">
      <h1>Profile Page</h1>

      <button className="signout p-4 text-white bg-primary rounded-md" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  )
}
