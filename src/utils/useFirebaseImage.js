import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useAtom } from 'jotai';
import { userAtom } from 'atoms/userAtom';

export const useFirebaseImage = (imagePath) => {
  const [user] = useAtom(userAtom);
  console.log(user.email, 'this is the user');

  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchImageUrl = async () => {
      const storage = getStorage();
      const imageRef = ref(storage, imagePath);
      try {
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (err) {
        console.error('Error fetching image from Firebase Storage:', err);
        setError(err);
      }
    };

    fetchImageUrl();
  }, [imagePath]);

  const uploadImage = async (file) => {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    console.log('Uploading image to:', imagePath);
    try {
      setIsUploading(true);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
    } catch (err) {
      setError(err);
    } finally {
      setIsUploading(false);
    }
  };

  const UploadButton = () => (
    <div className="absolute top-0 right-0 z-50 m-4">
      <label className="p-2 bg-white rounded shadow cursor-pointer">
        {isUploading ? 'Uploading...' : 'Upload Image'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              uploadImage(file);
            }
          }}
          disabled={isUploading}
        />
      </label>
    </div>
  );

  return { imageUrl, error, UploadButton };
};
