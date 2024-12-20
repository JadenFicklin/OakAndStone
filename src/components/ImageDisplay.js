import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  deleteObject,
  uploadBytes
} from 'firebase/storage';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms/userAtom';
import { cn } from 'utils/cn';

export const ImageDisplay = () => {
  const [imagesByCategory, setImagesByCategory] = useState({});
  const [visibilityState, setVisibilityState] = useState({});
  const [currentIndexes, setCurrentIndexes] = useState({});
  const categoryRefs = useRef({});
  const [user] = useAtom(userAtom);
  const storage = getStorage();

  const categories = useMemo(
    () => [
      { path: 'bathroom-remodels', displayName: 'Bathroom Remodels' },
      { path: 'custom-cabinets', displayName: 'Custom Cabinets' },
      { path: 'custom-woodwork', displayName: 'Custom Woodwork' },
      { path: 'kitchen-remodels', displayName: 'Kitchen Remodels' },
      { path: 'other-projects', displayName: 'Other Projects' }
    ],
    []
  );

  useEffect(() => {
    const fetchImagesByCategory = async () => {
      const categoryImages = {};
      try {
        for (const category of categories) {
          const folderRef = ref(storage, `images/${category.path}`);
          const folderContents = await listAll(folderRef);

          const urls = await Promise.all(
            folderContents.items.map(async (item) => ({
              url: await getDownloadURL(item),
              name: item.name
            }))
          );

          categoryImages[category.path] = urls;
        }
        setImagesByCategory(categoryImages);

        // Initialize currentIndexes with the first image index for each category
        const initialIndexes = {};
        Object.keys(categoryImages).forEach((key) => {
          initialIndexes[key] = 0;
        });
        setCurrentIndexes(initialIndexes);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImagesByCategory();
  }, [storage, categories]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const category = entry.target.getAttribute('data-category');
          if (entry.isIntersecting && !visibilityState[category]) {
            setVisibilityState((prevState) => ({
              ...prevState,
              [category]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRefs = categoryRefs.current;

    categories.forEach((category) => {
      if (currentRefs[category.path]) {
        observer.observe(currentRefs[category.path]);
      }
    });

    return () => {
      categories.forEach((category) => {
        if (currentRefs[category.path]) {
          observer.unobserve(currentRefs[category.path]);
        }
      });
    };
  }, [categories, visibilityState]);

  const handleAddImage = async (categoryPath, files) => {
    const uploadedImages = [];
    for (const file of files) {
      const newImageRef = ref(storage, `images/${categoryPath}/${file.name}`);
      try {
        await uploadBytes(newImageRef, file);
        const url = await getDownloadURL(newImageRef);
        uploadedImages.push({ url, name: file.name });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    setImagesByCategory((prev) => ({
      ...prev,
      [categoryPath]: [...prev[categoryPath], ...uploadedImages]
    }));
  };

  const removeImage = async (categoryPath, imageName) => {
    const imageRef = ref(storage, `images/${categoryPath}/${imageName}`);
    try {
      await deleteObject(imageRef);
      setImagesByCategory((prev) => ({
        ...prev,
        [categoryPath]: prev[categoryPath].filter(
          (img) => img.name !== imageName
        )
      }));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleNavigation = (categoryPath, direction) => {
    setCurrentIndexes((prev) => {
      const newIndex =
        direction === 'right'
          ? Math.min(
              prev[categoryPath] + 1,
              imagesByCategory[categoryPath].length - 1
            )
          : Math.max(prev[categoryPath] - 1, 0);
      return { ...prev, [categoryPath]: newIndex };
    });
  };

  return (
    <div>
      <div className="relative z-40 py-16 mt-24 text-6xl bg-white p-7 text-brown">
        <div
          className={cn(
            'h-[1px] absolute left-1/2 -translate-x-1/2  z-20 bg-gray-500 top-0  w-full'
          )}></div>
        Selected <br /> Works
      </div>
      <div className="hidden xl:block sticky z-30 w-full  pl-7 -mt-6  text-white bg-brown top-[64px]">
        Selected Works
      </div>

      {categories.map((category) => (
        <div
          key={category.path}
          ref={(el) => (categoryRefs.current[category.path] = el)}
          data-category={category.path}
          className="grid overflow-hidden h-[300px] md:h-[600px] columns-2 grid-cols-[30%_70%] relative">
          <div
            className={cn(
              'h-[1px] absolute left-1/2 -translate-x-1/2  z-20 bg-gray-500 top-0 duration-[3000ms]',
              visibilityState[category.path] ? 'w-full' : 'w-0'
            )}></div>
          <div
            className={cn(
              'relative duration-700 delay-400',
              visibilityState[category.path] ? 'opacity-100' : 'opacity-0'
            )}>
            <div className="p-1 md:p-7">
              <p className="text-xs text-gray-500 ">PROJECT</p>
              <h3 className="text-xl text-gray-800 md:text-2xl">
                {category.displayName}
              </h3>
            </div>
            <div className="absolute bottom-1 left-2 md:bottom-7 md:left-7">
              <div className="text-xs text-gray-500">
                IMAGES {currentIndexes[category.path] + 1} /{' '}
                {imagesByCategory[category.path]?.length || 0}
              </div>
              <div className="relative my-3 space-y-2 md:space-x-3 md:space-y-0 -left-1">
                <button
                  onClick={() => handleNavigation(category.path, 'left')}
                  disabled={currentIndexes[category.path] === 0}
                  className="px-5 py-1 text-sm rounded-full text-brown cursor-pointer border-brown border-[1px] disabled:opacity-50 group relative overflow-hidden">
                  <div className="absolute duration-300 -translate-x-1/2 -translate-y-1/2 rounded-full size-0 group-hover:size-20 left-1/2 top-1/2 bg-brown"></div>
                  <span className="relative z-10 duration-150 group-hover:text-white">
                    {' '}
                    Left{' '}
                  </span>
                </button>
                <button
                  onClick={() => handleNavigation(category.path, 'right')}
                  disabled={
                    currentIndexes[category.path] ===
                    imagesByCategory[category.path]?.length - 1
                  }
                  className="px-5 py-1 text-sm rounded-full text-brown cursor-pointer border-brown border-[1px] disabled:opacity-50 group relative overflow-hidden">
                  <div className="absolute duration-300 -translate-x-1/2 -translate-y-1/2 rounded-full size-0 group-hover:size-20 left-1/2 top-1/2 bg-brown"></div>
                  <span className="relative z-10 duration-150 group-hover:text-white">
                    {' '}
                    Right{' '}
                  </span>
                </button>
              </div>
            </div>
            <div
              className={cn(
                'w-[1px]  z-20 bg-gray-500 absolute top-0 right-0 duration-[3000ms]',
                visibilityState[category.path] ? 'h-full' : 'h-0'
              )}></div>
          </div>

          {/* small screens */}
          <div className="relative overflow-hidden md:hidden">
            <div className="absolute top-[0px] z-10 w-full bg-white h-9"></div>
            <div
              className="absolute top-1/2 left-6 -translate-y-1/2 flex h-[90%] space-x-6 "
              style={{
                transform: `translateX(-${
                  currentIndexes[category.path] * 224
                }px)`,
                transition: 'transform 0.5s ease'
              }}>
              {imagesByCategory[category.path]?.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    'relative flex-shrink-0 w-[200px] md:w-[600px] duration-[1500ms] ease-in-out',
                    visibilityState[category.path] ? 'top-0' : '-top-[100%]'
                  )}
                  style={{
                    transitionDelay: `${index * 0.5}s`
                  }}>
                  <img
                    src={image.url}
                    alt={`${category.displayName} ${index + 1}`}
                    className="absolute left-0 object-cover w-full h-full -top-1/2"
                  />
                  {user?.email && (
                    <button
                      onClick={() => removeImage(category.path, image.name)}
                      className="absolute text-white bg-red-500 rounded-full rotat size-8 -top-[40%] right-2">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* medium or larger screens */}
          <div className="relative hidden overflow-hidden md:flex">
            <div className="absolute top-[0px] z-10 w-full bg-white h-9"></div>
            <div
              className="absolute top-1/2 left-6 -translate-y-1/2 flex h-[90%] space-x-6 "
              style={{
                transform: `translateX(-${
                  currentIndexes[category.path] * 624
                }px)`,
                transition: 'transform 0.5s ease'
              }}>
              {imagesByCategory[category.path]?.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    'relative flex-shrink-0 w-[200px] md:w-[600px] duration-[1500ms] ease-in-out',
                    visibilityState[category.path] ? 'top-0' : '-top-[100%]'
                  )}
                  style={{
                    transitionDelay: `${index * 0.5}s`
                  }}>
                  <img
                    src={image.url}
                    alt={`${category.displayName} ${index + 1}`}
                    className="absolute left-0 object-cover w-full h-full -top-1/2"
                  />
                  {user?.email && (
                    <button
                      onClick={() => removeImage(category.path, image.name)}
                      className="absolute text-white bg-red-500 rounded-full size-8 -top-[48.5%] right-2">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {user?.email && (
            <div className="flex justify-center items-center w-[200px] h-[30px] absolute bottom-0 left-0 border-2 border-dashed border-gray-400">
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
                      handleAddImage(category.path, files);
                    }
                  }}
                />
              </label>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
