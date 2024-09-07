import { ParallaxSection } from 'components/ParallaxSection';
import { Title } from 'components/Title';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';
import { ImageModal } from 'utils/ImageModal'; // Import the ImageModal component
import { EditableText } from 'utils/EditableText'; // Import EditableText

import {
  getStorage,
  ref,
  getDownloadURL,
  listAll,
  deleteObject,
  uploadBytes
} from 'firebase/storage';
import { getDatabase, ref as dbRef, onValue } from 'firebase/database';

export const GallerySub = () => {
  const { subgallery } = useParams();
  const [imageCollection, setImageCollection] = useState([]);
  const [, setSubtext] = useState(''); // Store subtext from Firebase
  const [, setIsLoading] = useState(true);
  const [user] = useAtom(userAtom);
  const [modalIndex, setModalIndex] = useState(null); // State to track the currently opened image index

  const storage = getStorage();
  const folderPath = `images/${subgallery}/`;
  const db = getDatabase();

  // Utility function to format the subgallery name
  const formatTitle = (title) => {
    return title
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Fetch images from Firebase Storage
  useEffect(() => {
    const fetchImages = async () => {
      const listRef = ref(storage, folderPath);
      try {
        const res = await listAll(listRef);
        const imageUrls = await Promise.all(
          res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { url, name: itemRef.name };
          })
        );
        setImageCollection(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch subtext from Firebase Realtime Database
    const fetchSubtext = () => {
      const gallerySubPageRef = dbRef(db, 'gallerySubPageData');
      onValue(gallerySubPageRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          // Find the item where the slug matches subgallery
          const matchedItem = Object.values(data).find(
            (item) => item.slug === subgallery
          );

          if (matchedItem) {
            setSubtext(matchedItem.text); // Set subtext from Firebase
          }
        }
      });
    };

    fetchImages();
    fetchSubtext();
  }, [folderPath, db, subgallery, storage]);

  // Handle removing image
  const removeImage = async (imageName) => {
    const imageRef = ref(storage, `${folderPath}${imageName}`);
    try {
      await deleteObject(imageRef);
      setImageCollection((prev) =>
        prev.filter((image) => image.name !== imageName)
      );
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Handle adding new images
  const handleAddImage = async (files) => {
    const uploadedImages = [];
    for (let file of files) {
      const newImageRef = ref(storage, `${folderPath}${file.name}`);
      try {
        await uploadBytes(newImageRef, file);
        const url = await getDownloadURL(newImageRef);
        uploadedImages.push({ url, name: file.name });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    setImageCollection((prev) => [...prev, ...uploadedImages]);
  };

  // Handle opening the image modal
  const openModal = (index) => {
    setModalIndex(index);
  };

  // Handle closing the image modal
  const closeModal = () => {
    setModalIndex(null);
  };

  return (
    <>
      <Title>
        <Link to="/gallery" className="mx-5">
          <IoIosArrowRoundBack className="text-white size-10" />
        </Link>
        {/* Format subgallery name for display */}
        {formatTitle(subgallery)}
      </Title>

      {/* Parallax Section */}
      <div className="relative text-white">
        <ParallaxSection
          backgroundImage={
            imageCollection.length > 0 ? imageCollection[2].url : ''
          }
          height="400px"
          initialOffset={-35}
          parallaxSpeed={0.1}
          classname="grid w-9/12 gap-10 text-5xl text-left md:text-7xl"
          overlayColor="rgba(143, 99, 70, 0.4)">
          <h3 className="text-4xl md:text-6xl xl:text-8xl">
            {formatTitle(subgallery)}
          </h3>
          {/* Display editable subtext */}
          <EditableText
            firebasePath={`gallerySubPageData/${subgallery}/text`}
            className="mt-4 text-lg md:text-xl"
          />
        </ParallaxSection>
        <div className="absolute w-full h-full p-5 px-32 text-white -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 top-1/2 left-1/2 shadow-custom"></div>
      </div>

      {/* Image Gallery with Remove & Add functionality */}
      <div className="grid w-10/12 mx-auto my-6 gap-y-6">
        {imageCollection.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.url}
              alt={index}
              className="w-full object-cover max-h-[800px] max-w-[1200px] mx-auto cursor-pointer"
              onClick={() => openModal(index)} // Open modal on click
            />
            {user.email && (
              <button
                onClick={() => removeImage(image.name)}
                className="absolute p-1 text-white rotate-45 bg-red-500 rounded-full size-9 top-2 right-2">
                +
              </button>
            )}
          </div>
        ))}
        {/* Add new image button */}
        {user.email && (
          <div className="flex justify-center items-center w-full h-[400px] border-2 border-dashed border-gray-400">
            <label className="cursor-pointer">
              <span className="text-gray-500">+ Add New Images</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files.length > 0) {
                    handleAddImage(files);
                  }
                }}
              />
            </label>
          </div>
        )}
      </div>
      {modalIndex !== null && (
        <ImageModal
          images={imageCollection}
          currentIndex={modalIndex}
          onClose={closeModal}
        />
      )}
    </>
  );
};
