import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import CurrentUser from '../api/authentication/CurrentUser'

function OutletComp() {
    CurrentUser()

    return (
        <div className='max-w-[2560px] mx-auto'>
            <div className='fixed z-20 w-full'>
                <Header />
            </div>
            <div className='overflow-x-hidden'>
                <Outlet />
            </div>
        </div>
    )
}

export default OutletComp
