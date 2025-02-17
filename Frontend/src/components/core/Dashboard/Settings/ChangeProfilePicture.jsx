import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconBtn from '../../../common/IconBtn';
import { FiUpload } from 'react-icons/fi';
import { updateDisplayPicture } from '../../../../services/operations/SettingsAPI';

const ChangeProfilePicture = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = () => {
    try {
      console.log('uploading...');
      setLoading(true);
      const formData = new FormData();
      formData.append('displayPicture', imageFile);
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false);
      });
    } catch (err) {
      console.log('Error', err);
    }
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="flex flex-col lg:items-start justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 sm:px-12 text-richblack-5">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-x-4">
        {/* Profile Image */}
        <img
          src={previewSource || user?.image}
          className="aspect-square w-16 h-16 sm:w-[78px] sm:h-[78px] rounded-full object-cover"
          alt="Profile"
        />

        {/* Content */}
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-lg sm:text-xl font-semibold">Change Profile Picture</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Hidden File Input */}
            <input
              type="file"
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
              onChange={handleFileChange}
              ref={fileInputRef}
            />

            {/* Select Button */}
            <button
              onClick={handleClick}
              disabled={loading}
              className="cursor-pointer rounded-md bg-richblack-700 py-2 px-4 sm:px-5 font-semibold text-richblack-50"
            >
              Select
            </button>

            {/* Upload Button */}
            <IconBtn
              text={loading ? 'Uploading...' : 'Upload'}
              onClick={handleFileUpload}
              customClasses="w-full sm:w-auto"
            >
              {!loading && <FiUpload className="text-lg text-richblack-900" />}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePicture;