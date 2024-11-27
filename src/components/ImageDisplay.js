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
      { threshold: 0.1 } // Adjust threshold as needed
    );

    const currentRefs = categoryRefs.current; // Capture the current value of categoryRefs.current

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

  return (
    <div>
      {/* horizontal line */}
      <div className="relative py-16 mt-10 text-6xl p-7 text-brown">
        <div
          className={cn(
            'h-[1px] absolute left-1/2 -translate-x-1/2 bg-black bg-opacity-50 top-0  w-full'
          )}></div>
        Selected <br></br> Works
      </div>

      {categories.map((category) => (
        <div
          key={category.path}
          ref={(el) => (categoryRefs.current[category.path] = el)}
          data-category={category.path}
          className="grid overflow-hidden h-[700px] columns-2 grid-cols-[30%_70%] relative">
          {/* horizontal line */}
          <div
            className={cn(
              'h-[1px] absolute left-1/2 -translate-x-1/2 bg-black bg-opacity-50 top-0 duration-[3000ms]',
              visibilityState[category.path] ? 'w-full' : 'w-0'
            )}></div>
          {/* left text */}
          <div
            className={cn(
              'relative duration-700 delay-400',
              visibilityState[category.path] ? 'opacity-100' : 'opacity-0'
            )}>
            <div className="p-7">
              <p className="text-xs text-gray-500 ">PROJECT</p>
              <h3 className="text-2xl text-gray-800">{category.displayName}</h3>
            </div>
            {/* vertical line */}
            <div
              className={cn(
                'w-[1px] bg-black bg-opacity-50 absolute top-0 right-0 duration-[3000ms]',
                visibilityState[category.path] ? 'h-full' : 'h-0'
              )}></div>
          </div>
          {/* right images */}
          <div className="relative">
            <div className="absolute top-1/2 left-6 -translate-y-1/2 flex h-[90%] space-x-6 ">
              {imagesByCategory[category.path]?.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    'relative flex-shrink-0 w-[600px] duration-[1000ms]',
                    visibilityState[category.path] ? 'h-full' : 'h-0'
                  )}
                  style={{
                    transitionDelay: `${index * 0.5}s`
                  }}>
                  <img
                    src={image.url}
                    alt={`${category.displayName} ${index + 1}`}
                    className="absolute top-0 left-0 object-cover w-full h-full"
                  />
                  {user?.email && (
                    <button
                      onClick={() => removeImage(category.path, image.name)}
                      className="absolute text-white bg-red-500 rounded-full size-8 top-2 right-2">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {user?.email && (
            <div className="flex justify-center items-center w-full h-[200px] mt-4 border-2 border-dashed border-gray-400">
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
