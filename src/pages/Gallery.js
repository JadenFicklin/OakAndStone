import { galleryAtom } from 'atoms/galleryAtom';
import { Title } from 'components/Title';
import { galleryData } from 'data/Gallery';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { userAtom } from 'atoms/userAtom';
import { useAtom } from 'jotai';

export const Gallery = () => {
  // Initialize state to store image URLs
  const [firebaseImages, setFirebaseImages] = useState([]);
  const [, setGallery] = useAtom(galleryAtom);
  const [user] = useAtom(userAtom);

  // Memoize imagePaths so it's not recreated on every render
  const imagePaths = useMemo(
    () => [
      'images/gallery/custom-cabinets-8.jpg',
      'images/gallery/kitchen-remodel-3.jpg',
      'images/gallery/bathroom-remodel-12.jpg',
      'images/gallery/custom-woodwork-3.jpg',
      'images/gallery/other-projects-6.jpg'
    ],
    []
  );

  // Function to fetch the image URLs from Firebase Storage
  useEffect(() => {
    const fetchImages = async () => {
      const storage = getStorage();
      const promises = imagePaths.map(async (path) => {
        const imageRef = ref(storage, path);
        const url = await getDownloadURL(imageRef);
        return url;
      });

      const urls = await Promise.all(promises);
      setFirebaseImages(urls);
    };

    fetchImages();
  }, [imagePaths]); // imagePaths is now memoized and stable

  // Function to handle image upload
  const uploadImage = async (index, file) => {
    const storage = getStorage();
    const imagePath = imagePaths[index]; // Get the path of the image to replace
    const imageRef = ref(storage, imagePath); // Reference to the image in Firebase Storage

    try {
      // Upload the new image
      await uploadBytes(imageRef, file);
      // Fetch the new image URL after upload
      const url = await getDownloadURL(imageRef);

      // Update the local image URL after uploading
      const updatedImages = [...firebaseImages];
      updatedImages[index] = url;
      setFirebaseImages(updatedImages); // Update state to re-render the image
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Title>Gallery</Title>
      <h2 className="w-10/12 py-10 mx-auto text-3xl text-center md:text-6xl text-brown playfair">
        Crafting Excellence: Explore Our Portfolio of Custom Woodwork and
        Designs
      </h2>

      <div className="flex flex-wrap items-start justify-center w-9/12 gap-10 pb-10 mx-auto my-10 text-white xl:py-10 xl:pb-20">
        {galleryData.map((item, index) => (
          <div
            key={index}
            className="relative w-full md:w-[240px] md:aspect-square">
            {' '}
            {/* Ensure square aspect ratio */}
            <Link
              to={`/gallery/${item.slug}`}
              className="relative w-full h-[240px] md:w-[240px] md:h-auto md:aspect-square overflow-hidden hover:scale-105 duration-150 group cursor-pointer"
              onClick={() => {
                setGallery(item.link);
                scrollToTop();
              }}>
              {firebaseImages[index] ? (
                <img
                  src={firebaseImages[index]}
                  alt={item.title}
                  className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                  Loading...
                </div>
              )}
              {/* Image title overlay */}
              <div className="absolute left-0 w-10/12 p-2 text-lg text-white duration-300 bg-black bottom-5 bg-opacity-60 group-hover:w-full h-max">
                {item.title}
              </div>
            </Link>
            {/* Display upload button */}
            {user.email && (
              <div className="absolute top-0 right-0 z-50 m-4">
                <label className="p-2 text-black bg-white rounded shadow cursor-pointer">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        uploadImage(index, file);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
