import React, { useEffect, useState, useRef } from "react";
import { Link, matchPath } from "react-router-dom";
import logo from "../../assets/Logo/Logo.svg";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import ProfileDropdown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/ApiConnector";
import { categories } from "../../services/Apis";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0); // Track loading progress
  const menuRef = useRef(null);

  // Simulate smooth website loading progress
  useEffect(() => {
    let animationFrameId;
    let startTime = null;

    const animateLoading = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const duration = 3000; // 3 seconds
      const progressPercentage = Math.min((progress / duration) * 100, 100);

      setLoadingProgress(progressPercentage);

      if (progressPercentage < 100) {
        animationFrameId = requestAnimationFrame(animateLoading);
      }
    };

    animationFrameId = requestAnimationFrame(animateLoading);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      console.log('catergory res', res)
      setSubLinks(res?.data?.data);
    } catch (error) {
      console.log("Could not fetch Categories.", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex justify-center items-center h-14 border-b-[1px] border-b-richblue-700">
      {/* Loading Progress Bar */}
      {loadingProgress < 100 && (
        <div
          className="fixed top-0 left-0 h-[2px] bg-yellow-100 z-50 transition-all duration-300 ease-linear"
          style={{ width: `${loadingProgress}%` }}
        ></div>
      )}

      <div className="flex w-11/12 max-w-maxContent justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img className="w-[140px]" src={logo} alt="Logo" />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"
                      }`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks && subLinks.length ? (
                        subLinks
                          .filter((subLink) => subLink?.courses?.length > 0)
                          .map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                              key={i}
                            >
                              <p>{subLink.name}</p>
                            </Link>
                          ))
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login/Signup/Dashboard */}
        <div className="flex gap-x-4 lg:gap-x-5 items-center">
          {user && user.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[5px] lg:px-[12px] py-[6px] lg:py-[8px] text-richblack-100 text-sm">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[5px] lg:px-[12px] py-[6px] lg:py-[8px] text-richblack-100 text-sm">
                Sign up
              </button>
            </Link>
          )}

          {token !== null && <ProfileDropdown />}

          {/* Mobile Menu Button */}
          <button className="mr-4 md:hidden z-10 transition-transform duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <AiOutlineClose fontSize={24} fill="#AFB2BF" className="transform rotate-180" />
            ) : (
              <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
            )}
          </button>
        </div>
      </div>

      {/* Background Overlay for Blur Effect */}
      {isMobileMenuOpen && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[1px] z-10 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}></div>
      )}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 w-[200px] bg-richblack-800 z-20 transform transition-transform duration-300 ease-in ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className={`flex flex-col gap-5 text-xl p-8 transition-opacity duration-200 ${isMobileMenuOpen ? "opacity-100 delay-200" : "opacity-0"}`}>
          {NavbarLinks.map((link, index) => (
            <li key={index}>
              {link.title === "Catalog" ? (
                <div
                  className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-100"
                    }`}
                >
                  <p>{link.title}</p>
                  <BsChevronDown />
                  <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                    <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                    {loading ? (
                      <p className="text-center">Loading...</p>
                    ) : subLinks && subLinks.length ? (
                      subLinks
                        .filter((subLink) => subLink?.courses?.length > 0)
                        .map((subLink, i) => (
                          <Link
                            to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                            key={i}
                          >
                            <p>{subLink.name}</p>
                          </Link>
                        ))
                    ) : (
                      <p className="text-center">No Courses Found</p>
                    )}
                  </div>
                </div>
              ) : (
                <Link to={link?.path}>
                  <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-100"}`}>
                    {link.title}
                  </p>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
