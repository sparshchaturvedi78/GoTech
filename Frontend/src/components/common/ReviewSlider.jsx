import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css";
import { FaStar } from "react-icons/fa";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { apiConnector } from "../../services/ApiConnector";
import { ratingsEndpoints } from "../../services/Apis";

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    (async () => {
      const data = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API);
      if (data?.data?.success) {
        setReviews(data?.data?.data);
        console.log("reviews state", data?.data?.data);
      }
    })();
  }, []);

  return (
    <div className="text-white -mb-10">
      <div className="my-[50px] h-[300px] max-w-[1200px] mx-auto">
        <Swiper
          slidesPerView={1} // Default for mobile
          spaceBetween={20}
          loop={reviews.length > 1} // Only loop if there are multiple reviews
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          centeredSlides={reviews.length === 1} // Center slide if there's only one review
          breakpoints={{
            640: {
              slidesPerView: reviews.length >= 2 ? 2 : 1, // For tablets
              centeredSlides: reviews.length === 1, // Center slide if there's only one review
            },
            1024: {
              slidesPerView: reviews.length >= 4 ? 4 : reviews.length >= 2 ? 2 : 1, // For desktops
              centeredSlides: reviews.length === 1, // Center slide if there's only one review
            },
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full h-full"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-3 bg-richblack-800 p-4 rounded-lg h-[200px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 mx-auto max-w-[300px]">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt="Profile"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                    <h2 className="text-sm font-medium text-richblack-500">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>
                <p className="text-sm font-medium text-richblack-25 flex-grow overflow-hidden">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ...`
                    : `${review?.review}`}
                </p>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </h3>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewSlider;
