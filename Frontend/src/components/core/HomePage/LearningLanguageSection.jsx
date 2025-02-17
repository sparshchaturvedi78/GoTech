import React from 'react'
import HighlightText from './HighlightText'
import CTAButton from "../../common/Button";
import Know_your_progress from "../../../assets/Images/Know_your_progress.svg";
import Compare_with_others from "../../../assets/Images/Compare_with_others.svg";
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg";

const LearningLanguageSection = () => {
    return (
        <div className='lg:my-10 my-5'>
            <div className='flex flex-col gap-5 items-center'>
                <div className='text-4xl font-semibold text-center'>
                    Your swiss knife for
                    <HighlightText text={"learning any language"} />
                </div>
                <div className="text-center text-richblack-700 font-medium lg:w-[60%] mx-auto leading-6 text-base">
                    Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
                </div>

                <div className='mx-auto flex lg:flex-row flex-col items-center justify-center mt-10 lg:mt-0'>
                    <img src={Know_your_progress}
                        alt='KnowYourProgress'
                        className='object-contain lg:-mr-32 '
                    />
                    <img src={Compare_with_others}
                        alt='KnowYourProgress'
                        className='object-contain lg:-mb-10 lg:-mt-0 -mt-12'
                    />
                    <img src={Plan_your_lessons}
                        alt='KnowYourProgress'
                        className='object-contain lg:-ml-36 lg:-mt-5 -mt-16'
                    />
                </div>
                <div className='w-fit mx-auto lg:mb-10 mb-8 mt-8 '>
                    <CTAButton active={true} linkto="/signup">
                        Learn More
                    </CTAButton>
                </div>
            </div>
        </div>
    )
}

export default LearningLanguageSection