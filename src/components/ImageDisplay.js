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
          className="p-4 mb-8 border-2 border-gray-300 rounded-md">
          <h3 className="mb-4 text-3xl font-bold">{category.displayName}</h3>
          <div className="grid grid-cols-3 gap-4">
            {imagesByCategory[category.path]?.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={`${category.displayName} ${index + 1}`}
                  className="w-full h-auto rounded-md"
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
