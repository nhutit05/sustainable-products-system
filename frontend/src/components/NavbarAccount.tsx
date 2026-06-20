import { useNavigate } from 'react-router-dom'

export default function NavbarAccount() {
  const navigate = useNavigate()
  return (
    <div
      className="navbar_account h-8 w-8 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform border border-green-200 hover:border-green-400 shadow-md"
      onClick={() => navigate('/profile')}
    >
      <img src="/user_default.jpg" alt="Avatar" className="navbar_account--avatar" />
    </div>
  )
}
