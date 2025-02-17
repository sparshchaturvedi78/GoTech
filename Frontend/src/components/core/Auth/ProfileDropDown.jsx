import React, { useRef, useState, useEffect } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../services/operations/authAPI";
import { setUser } from "../../../slices/profileSlice";
import ConfirmationModal from '../../common/ConfirmationModal';

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  if (!user) return null;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const userImage =
        userData.image ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${userData.firstName} ${userData.lastName}`;
      dispatch(setUser({ ...userData, image: userImage }));
    }
  }, [dispatch]);


  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        className="flex items-center gap-x-1"
        onMouseEnter={() => setOpen(true)} // Open dropdown on hover (desktop)
        onMouseLeave={() => setOpen(false)} // Close dropdown when mouse leaves (desktop)
        onClick={() => setOpen(!open)} // Toggle dropdown on click (mobile)
        aria-expanded={open}
        aria-label="Profile dropdown"
      >
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </button>

      {/* Dropdown Menu */}
      <div
        onMouseEnter={() => setOpen(true)} // Keep dropdown open when hovering over it (desktop)
        onMouseLeave={() => setOpen(false)} // Close dropdown when mouse leaves (desktop)
        className={`absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800 transition-all duration-200 ease-in-out ${open
            ? "translate-y-0 opacity-100 visible"
            : "translate-y-2 opacity-0 invisible"
          }`}
      >
        <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
          <div className="flex items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
            <VscDashboard className="text-lg" />
            Dashboard
          </div>
        </Link>
        <div
          onClick={() => {
            setConfirmationModal({
              text1: "Are you sure?",
              text2: "You will be logged out of your account.",
              btn1Text: "Logout",
              btn2Text: "Cancel",
              bt1Handler: () => dispatch(logout(navigate)),
              bt2Handler: () => setConfirmationModal(null),
            });
            setOpen(false);
          }}
          className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
        >
          <VscSignOut className="text-lg" />
          Logout
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}