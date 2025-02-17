import React from 'react';

const IconBtn = ({
    text,
    children,
    onClick,
    disabled,
    outline = false,
    customClasses,
    type,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center ${outline ? 'border border-yellow-50 bg-transparent' : 'bg-yellow-50'
                } cursor-pointer rounded-md py-2 px-5 font-semibold text-richblack-900 ${children ? 'gap-x-2' : '' // Add gap only if children are present
                } ${customClasses}`}
        >
            {children ? (
                <>
                    <span className={`${outline && 'text-yellow-50'}`}>{text}</span>
                    {children}
                </>
            ) : (
                text
            )}
        </button>
    );
};

export default IconBtn;