import LoadingSpinner from '@/app/components/shared/loading-spinner'
import { AiOutlineLogout } from 'react-icons/ai'
import { useUser } from '@/app/utils/providers/UserContext'
import { useLogoutPartner } from '@/app/queries/auth'
import { useRouter } from 'next/navigation'

type PropsType =  {
    restaurantName: string | undefined, 
  partnerName: string | undefined,
  email: string | undefined,
  logo?: string
}
export default function Header({ restaurantName, partnerName, email, logo }: PropsType) {
    const {user} = useUser()
const { mutate: logout, isPending } = useLogoutPartner();
const router = useRouter();
    const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/auth/partner/login");
      },
      onError: (error) => {
        router.push("/auth/partner/login");
      },
    });
  };
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-3">
          {logo && (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
              <img src={logo} alt={restaurantName} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
              {restaurantName || 'Restaurant Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Welcome, {partnerName}!
              </p>
              <p className="text-xs text-gray-500">
                {email}
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AiOutlineLogout className="h-4 w-4" />
              <span>Logout</span>
              {isPending && <LoadingSpinner size="small" />}
            </button>
          </div>
        </div>
      </header>
  )
}