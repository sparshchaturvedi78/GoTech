import React from 'react'
import CTAButton from '../../common/Button'
import HighlightText from '../HomePage/HighlightText';

const LearningGridArray = [
    {
        order: -1,
        heading: "World-Class Learning for",
        highlightText: "Anyone, Anywhere",
        description:
            "GoTech partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
        BtnText: "Learn More",
        BtnLink: "/",
    },
    {
        order: 1,
        heading: "Curriculum Based on Industry Needs",
        description:
            "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
    },
    {
        order: 2,
        heading: "Our Learning Methods",
        description:
            "GoTech partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 3,
        heading: "Certification",
        description:
            "GoTech partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 4,
        heading: `Rating "Auto-grading"`,
        description:
            "GoTech partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 5,
        heading: "Ready to Work",
        description:
            "GoTech partners with more than 275+ leading universities and companies to bring",
    },
];

const LearningGrid = () => {
    return (
        <div className="grid mx-auto w-[350px] lg:w-full grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
        {LearningGridArray.map((card, i) => (
          <div
            key={i}
            className={`${
              card.order < 0
                ? "lg:col-span-2 lg:h-[294px] bg-transparent"
                : card.order % 2 === 1
                ? "bg-richblack-700 h-[294px] hover:scale-95 transition-all duration-300" 
                : "bg-richblack-800 h-[294px] hover:scale-95 transition-all duration-300"
            } ${card.order === 3 ? "lg:col-start-2" : ""} p-6`}
          >
            {card.order < 0 ? (
              <div className="lg:w-[90%] flex flex-col gap-3">
                <h2 className="text-4xl font-semibold">
                  {card.heading}
                  <HighlightText text={card.highlightText} />
                </h2>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
                <div className="mt-4">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold">{card.heading}</h3>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    )
}

export default LearningGrid
