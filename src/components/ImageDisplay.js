import React, { useState, useEffect, useMemo } from 'react';
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

export const ImageDisplay = () => {
  const [imagesByCategory, setImagesByCategory] = useState({});
  const [user] = useAtom(userAtom); // Using userAtom for authentication check
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

  // Handle removing an image
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

  // Handle adding new images
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

  return (
    <div>
      <h2 className="mb-8 text-6xl text-brown">Selected Works</h2>
      {categories.map((category) => (
        <div
          key={category.path}
          className="grid overflow-hidden h-[700px] columns-2 grid-cols-[30%_70%] relative">
          {/* Top horizontal line */}
          <div className="w-full h-[1px] bg-blue-500 absolute top-0 left-0"></div>

          {/* Left text */}
          <div className="relative">
            <p className="mb-4 text-sm">PROJECT NAME</p>
            <h3 className="mb-4 text-2xl">{category.displayName}</h3>
            {/* Right vertical line */}
            <div className="w-[1px] h-full bg-blue-500 absolute top-0 right-0"></div>
          </div>

          {/* Images */}
          <div className="relative">
            <div className="absolute top-1/2 left-6 -translate-y-1/2 flex h-[90%] space-x-6 ">
              {imagesByCategory[category.path]?.map((image, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={image.url}
                    alt={`${category.displayName} ${index + 1}`}
                    className="object-contain w-auto h-full"
                  />

                  {/* Delete button */}
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

          {/* Add new images */}
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
