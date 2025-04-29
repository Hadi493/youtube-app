import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import userData from '../zustand/userData';

function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUserData = userData((state) => state.currentUserData);
    // console.log(currentUserData.data._id)

    const handleDesktopNavigation = () => {
        if (location.pathname !== '/desktop/videos') {
            navigate('/desktop/videos');
        }
    };

    const sidebarVal = [
        {
            "name": "Home",
            "src": "/home.svg",
            "link": "/"
        },
        {
            "name": "Subscriptions",
            "src": "/subscription.svg",
            "link": "/"
        },
        {
            "name": "You",
            "src": "/currentUser.svg",
            "link": `/userSection`,
            // "onClick": handleDesktopNavigation
        },
        {
            "name": "Downloads",
            "src": "/download.svg",
            "link": "/"
        },
    ];

    return (
        <div className='flex lg:flex-col bg-[#000] left-0 lg:bg-[#0000] w-full lg:w-[4rem] gap-8 text-white justify-center lg:justify-normal lg:gap-8 p-3 pr-6 lg:p-0'>
            {sidebarVal.map((value) => (
                <div key={value.name} className='flex flex-col items-center'>
                    {value.onClick ? (
                        <button 
                            onClick={value.onClick}
                            aria-label={value.name} 
                            title={value.name} 
                            className='flex items-center flex-col hover:opacity-75 focus:opacity-100'
                        >
                            <img className="w-[1.6rem]" src={value.src} alt={value.name} />
                            <p className='text-[0.60rem]'>{value.name}</p>
                        </button>
                    ) : (
                        <Link to={value.link}>
                            <button 
                                aria-label={value.name} 
                                title={value.name} 
                                className='flex items-center flex-col hover:opacity-75 focus:opacity-100'
                            >
                                <img className="w-[1.6rem]" src={value.src} alt={value.name} />
                                <p className='text-[0.60rem]'>{value.name}</p>
                            </button>
                        </Link>
                    )}
                </div>
            ))}
        </div>
    );
}

export default SideBar;