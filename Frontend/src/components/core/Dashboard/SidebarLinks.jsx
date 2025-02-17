import React from 'react'
import * as Icons from 'react-icons/vsc'
import { useDispatch } from 'react-redux';
import { matchRoutes, NavLink, useLocation } from 'react-router-dom';
import { matchPath } from 'react-router-dom';



const SidebarLinks = ({ link, onClick }) => {

    const Icon = Icons[link.icon];
    const location = useLocation();

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }

    return (
        <NavLink
            to={link.path}
            onClick={onClick}
            // onClick={ }
            className={`relative px-8 py-2 text-sm font-medium  ${matchRoute(link.path) ? "bg-yellow-800 text-yellow-50" : "bg-opacity-0 text-richblack-100"}  transition-all duration-200`}
        >

            <span className={`absolute left-0 top-0 w-[0.2rem] h-full bg-yellow-5 ${matchRoute(link.path) ?
                "opacity-100" : "opacity-0"}`} />

            <div className="flex items-center gap-x-2">
                {/* Icon Goes Here */}
                <Icon className="text-lg" />
                <span>{link.name}</span>
            </div>

        </NavLink>
    )
}

export default SidebarLinks