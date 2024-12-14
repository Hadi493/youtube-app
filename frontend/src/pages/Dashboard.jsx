// import React from 'react'
import Wrapper from '../components/Wrapper';
import { SignOut } from '../api/authentication/authApi';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import userData from '../zustand/userData';

function Dashboard() {
  const currentUserData = userData((state) => state.currentUserData);
  const navigate = useNavigate()
  const storageVlaue = sessionStorage.getItem('isLogin')
  const isUserFlag = JSON.parse(storageVlaue)

  return isUserFlag ? (
    <Wrapper>
      <div className='text-white'>
        <nav className="bg-gray-50 dark:bg-[#18181b] w-full top-14 left-0 fixed z-10">
          <div className="px-4 py-4 flex justify-between items-center">
            <ul className="flex space-x-4 font-medium flex-wrap">
              <li className='sm:text-lg text-[9px]'>
                <Link
                  to="videoDashboard"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
              <li className='sm:text-lg text-[9px]'>
                <Link
                  to="userDashboard"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg>
                  <span className="ml-3">Users</span>
                </Link>
              </li>
              <li className='sm:text-lg text-[9px]'>
                <Link
                  to="/login"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                    />
                  </svg>
                  <span onClick={() => SignOut()} className="ml-3">Sign Out</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Outlet />

      </div>
    </Wrapper>
  ) : (<Wrapper>
    <div className='h-full w-full flex items-center flex-col gap-2 justify-center text-white mt-44'>
      <div>Just login mf</div>
      <button onClick={()=> navigate('/login')} className='bg-blue-700 w-28 px-9 py-2 rounded-sm'>Login</button>
    </div>
  </Wrapper>)
}

export default Dashboard
