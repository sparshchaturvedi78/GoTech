import React from 'react'
import IconBtn from '../../../common/IconBtn'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { buyCourse } from '../../../../services/operations/studentFeaturesAPI' 

const RenderTotalAmount = () => {
    const {total, cart} = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        buyCourse(token, courses, user, navigate, dispatch)
    }
    return (
        <div>
            <div className="min-w-[280px] rounded-md border-[1px] lg:ml-0 ml-16 border-richblack-700 bg-richblack-800 p-6">
                <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
                <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
                <IconBtn
                    text="Buy Now"
                    onClick={handleBuyCourse}
                    customClasses="w-full justify-center"
                />
            </div>
        </div>
    )
}

export default RenderTotalAmount