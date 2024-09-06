import { Title } from 'components/Title';
import { cn } from 'utils/cn';
import { EditableText } from 'utils/EditableText';
import { useState, useEffect } from 'react';
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes
} from 'firebase/storage';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';

export const Process = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [imageRefs, setImageRefs] = useState([]);
  const [user] = useAtom(userAtom);

  useEffect(() => {
    const fetchImageUrls = async () => {
      const storage = getStorage();
      const processImagesRef = ref(storage, 'images/process/');

      try {
        const res = await listAll(processImagesRef);
        const urls = await Promise.all(
          res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return url;
          })
        );

        setImageUrls(urls);
        setImageRefs(res.items);

        console.log('Image URLs:', urls);
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    };

    fetchImageUrls();
  }, []);

  const handleImageUpload = async (file, index) => {
    const imageRef = imageRefs[index];
    try {
      await uploadBytes(imageRef, file);
      const newUrl = await getDownloadURL(imageRef);
      setImageUrls((prev) => {
        const updatedUrls = [...prev];
        updatedUrls[index] = newUrl;
        return updatedUrls;
      });
      console.log('Image updated:', newUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <>
      <Title>Our Process</Title>

      <div className="w-8/12 py-10 pb-20 mx-auto text-center">
        <EditableText
          firebasePath="titles/process"
          className="text-3xl md:text-6xl text-brown playfair"
        />
      </div>

      <div className="grid w-10/12 mx-auto mb-20 lg:w-8/12 gap-y-6 text-brown">
        {imageUrls.map((url, index) => (
          <div key={index}>
            <div className="grid gap-y-6 lg:grid-cols-2 lg:items-center">
              <EditableText
                firebasePath={`processPageData/${index}/title`}
                className="text-3xl lg:hidden"
              />
              <img
                src={url}
                alt={`Process step ${index + 1}`}
                className="lg:order-2 lg:mx-auto"
              />
              <div className="lg:grid lg:content-evenly lg:w-3/4">
                <EditableText
                  firebasePath={`processPageData/${index}/title`}
                  className="hidden my-6 text-3xl lg:block"
                />
                <EditableText
                  className="my-2 text-base"
                  firebasePath={`processPageData/${index}/text`}
                />
              </div>
            </div>

            {/* Upload Button */}
            {user.email && (
              <div className="relative flex justify-end -top-12 right-2">
                <label className="p-2 bg-white rounded shadow cursor-pointer">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleImageUpload(file, index);
                      }
                    }}
                  />
                </label>
              </div>
            )}
            <div
              className={cn(
                'w-full h-[1px] bg-brown my-10',
                index === imageUrls.length - 1 && 'hidden'
              )}></div>
          </div>
        ))}
      </div>
    </>
  );
};
