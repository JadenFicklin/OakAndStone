import React, { useState, useEffect, useCallback } from 'react';
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from 'react-icons/io';

export const ImageModal = ({ images, currentIndex, onClose }) => {
  const [index, setIndex] = useState(currentIndex);

  // Memoized nextImage function to avoid re-creation on each render
  const nextImage = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // Memoized prevImage function to avoid re-creation on each render
  const prevImage = useCallback(() => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // Memoized onClose to avoid re-creation on each render
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle keypress events for left/right navigation and closing the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextImage, prevImage, handleClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      {/* Background click to close */}
      <div onClick={handleClose} className="absolute inset-0 z-40"></div>

      {/* Modal content container */}
      <div
        className="relative z-50 w-11/12 max-w-4xl mx-auto "
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 p-2 text-white scale-50 bg-black rounded-full lg:scale-100 lg:top-4 lg:right-4">
          <IoMdClose size={24} />
        </button>

        {/* Left arrow */}
        <button
          onClick={prevImage}
          className="absolute left-0 z-50 p-2 text-white scale-50 -translate-y-1/2 bg-white rounded-full lg:scale-100 lg:-left-16 top-1/2 bg-opacity-60">
          <IoIosArrowBack size={30} />
        </button>

        {/* Image */}
        <img
          src={images[index].url}
          alt={index}
          className="object-contain w-full max-h-[90vh] mx-auto transition-transform duration-300"
          style={{ userSelect: 'none' }} // Prevent image from being highlighted
        />

        {/* Right arrow */}
        <button
          onClick={nextImage}
          className="absolute right-0 z-50 p-2 text-white scale-50 -translate-y-1/2 bg-white rounded-full lg:scale-100 lg:-right-16 top-1/2 bg-opacity-60">
          <IoIosArrowForward size={30} />
        </button>
      </div>
    </div>
  );
};
