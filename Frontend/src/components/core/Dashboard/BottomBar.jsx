import React, { useState } from 'react';
import { sidebarLinks } from '../../../data/dashboard-links';
import { logout } from '../../../services/operations/authAPI';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../common/ConfirmationModal';
import { VscSignOut, VscSettingsGear } from 'react-icons/vsc';
import { RiMenuUnfold3Line } from 'react-icons/ri';
import SidebarLink from './SidebarLinks';
import { Link, useLocation, matchPath } from 'react-router-dom';

const BottomBar = () => {
  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  }

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay (Visible when menu is open) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-[1px] md:hidden"
          onClick={() => setIsMenuOpen(false)} // Close menu when clicking outside
        />
      )}

      {/* Floating Action Button (FAB) */}
      <button
        className="fixed bottom-4 left-4 z-50 p-4 bg-richblack-800 text-richblack-100 rounded-full shadow-lg md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <RiMenuUnfold3Line className="text-2xl" />
      </button>

      {/* Drawer Menu */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-richblack-800 text-richblack-100 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'
          } md:hidden`}
      >
        <div className="flex flex-col p-6 space-y-4">
          {/* Render Sidebar Links */}
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink
                key={link.id}
                link={link}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-x-3 p-3 rounded-lg hover:bg-richblack-700 transition-colors duration-200"
              />
            );
          })}

          {/* Divider */}
          <div className="mx-auto h-[1px] w-10/12 bg-richblack-700" />

          {/* Settings Link */}
          <Link to={"/dashboard/settings"}
            className={`flex items-center gap-x-3 p-3 rounded-lg hover:bg-richblack-700 transition-colors duration-200 ${matchRoute("/dashboard/settings") ? "bg-yellow-800 text-yellow-50" : "bg-opacity-0 text-richblack-100"}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <VscSettingsGear className="text-xl" />
            <span>Settings</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                bt1Handler: () => dispatch(logout(navigate)),
                bt2Handler: () => setConfirmationModal(null),
              })
            }
            className="flex items-center gap-x-3 p-3 rounded-lg hover:bg-richblack-700 transition-colors duration-200"
          >
            <VscSignOut className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default BottomBar;