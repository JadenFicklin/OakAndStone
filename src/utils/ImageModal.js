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

  // Handle clicks outside the modal content
  const handleOutsideClick = (e) => {
    if (
      e.target.closest('.modal-content') === null &&
      e.target.closest('.arrow-button') === null
    ) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={handleOutsideClick} // Handle clicks outside the modal content
    >
      {/* Modal content container */}
      <div
        className="relative z-50 w-11/12 max-w-4xl mx-auto modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {/* Modal image container with background */}
        <div
          className="relative w-full bg-center bg-cover"
          style={{
            backgroundImage: `url(${images[index].url})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '90vh',
            height: 'auto',
            paddingTop: '56.25%'
          }}></div>
        {/* Close button relative to the image */}

        {/* Left arrow */}
        <button
          onClick={prevImage}
          className="absolute left-0 z-50 p-2 text-white scale-50 -translate-y-1/2 bg-white rounded-full lg:scale-100 lg:-left-16 top-1/2 bg-opacity-60 arrow-button">
          <IoIosArrowBack size={30} />
        </button>

        {/* Right arrow */}
        <button
          onClick={nextImage}
          className="absolute right-0 z-50 p-2 text-white scale-50 -translate-y-1/2 bg-white rounded-full lg:scale-100 lg:-right-16 top-1/2 bg-opacity-60 arrow-button">
          <IoIosArrowForward size={30} />
        </button>
      </div>
      <button
        onClick={handleClose}
        className="absolute right-0 z-50 p-2 text-white scale-50 bg-white rounded-full top-2 lg:right-2 lg:scale-100 bg-opacity-60 arrow-button">
        <IoMdClose size={20} />
      </button>
    </div>
  );
};
