import { Title } from 'components/Title';
import { cn } from 'utils/cn';
import { EditableText } from 'utils/EditableText';
import { useState, useEffect } from 'react';
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject
} from 'firebase/storage';
import {
  getDatabase,
  ref as dbRef,
  set,
  remove,
  push,
  onValue
} from 'firebase/database';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';

export const Process = () => {
  const [, setImageUrls] = useState([]);
  const [, setImageRefs] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [newProcessStep, setNewProcessStep] = useState({
    title: '',
    text: '',
    image: null
  });
  const [loading, setLoading] = useState(false); // Track loading state
  const [user] = useAtom(userAtom);

  const db = getDatabase();
  const storage = getStorage();

  useEffect(() => {
    const fetchProcessData = async () => {
      // Fetching process data from Firebase Realtime Database
      const processRef = dbRef(db, 'processPageData');
      onValue(processRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProcessSteps(Object.entries(data)); // Convert to an array of key-value pairs
        }
      });

      // Fetching images from Firebase Storage
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
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    };

    fetchProcessData();
  }, [db, storage]);

  const handleImageUpload = async (file, key) => {
    setLoading(true); // Set loading to true when upload starts
    try {
      // Upload new image to Firebase Storage
      const imageRef = ref(storage, `images/process/${file.name}`);
      await uploadBytes(imageRef, file);
      const newUrl = await getDownloadURL(imageRef);

      // Update the imageUrl in Firebase Realtime Database
      const processStepRef = dbRef(db, `processPageData/${key}/imageUrl`);
      await set(processStepRef, newUrl);

      // Update the local state with the new image URL
      setImageUrls((prev) => {
        const updatedUrls = [...prev];
        const stepIndex = processSteps.findIndex(
          ([stepKey]) => stepKey === key
        );
        updatedUrls[stepIndex] = newUrl;
        return updatedUrls;
      });
    } catch (error) {
      console.error('Error uploading and updating image:', error);
    } finally {
      setLoading(false); // Set loading to false when upload completes
    }
  };

  const handleAddNewProcessStep = async () => {
    if (!newProcessStep.title || !newProcessStep.text || !newProcessStep.image)
      return alert('Please fill in all fields.');

    setLoading(true); // Set loading to true when adding new step
    try {
      // Upload image to Firebase Storage
      const imageRef = ref(
        storage,
        `images/process/${newProcessStep.image.name}`
      );
      await uploadBytes(imageRef, newProcessStep.image);
      const imageUrl = await getDownloadURL(imageRef);

      // Add new process step to Firebase Database
      const newProcessRef = push(dbRef(db, 'processPageData'));
      await set(newProcessRef, {
        title: newProcessStep.title,
        text: newProcessStep.text,
        imageUrl
      });

      // Clear form
      setNewProcessStep({ title: '', text: '', image: null });
    } catch (error) {
      console.error('Error adding new process step:', error);
    } finally {
      setLoading(false); // Set loading to false when process completes
    }
  };

  const handleDeleteProcessStep = async (key, imageUrl) => {
    try {
      // Delete from Firebase Database
      const processRef = dbRef(db, `processPageData/${key}`);
      await remove(processRef);

      // Delete image from Firebase Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting process step:', error);
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
        {processSteps.map(([key, stepData], index) => (
          <div key={key}>
            <div className="grid gap-y-6 lg:grid-cols-2 lg:items-center">
              <EditableText
                firebasePath={`processPageData/${key}/title`}
                className="text-3xl lg:hidden"
              />
              <img
                src={stepData.imageUrl}
                alt={`Process step ${index + 1}`}
                className="lg:order-2 lg:mx-auto"
              />
              <div className="lg:grid lg:content-evenly lg:w-3/4">
                <EditableText
                  firebasePath={`processPageData/${key}/title`}
                  className="hidden my-6 text-3xl lg:block"
                />
                <EditableText
                  className="my-2 text-base"
                  firebasePath={`processPageData/${key}/text`}
                />
              </div>
            </div>

            {/* Upload Button */}
            {user.email && (
              <div className="relative flex justify-end -top-12 right-2">
                <label className="p-2 bg-white rounded shadow cursor-pointer">
                  {loading ? 'Up ' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleImageUpload(file, key);
                      }
                    }}
                    disabled={loading} // Disable input when loading
                  />
                </label>
              </div>
            )}

            {/* Delete Button */}
            {user.email && (
              <div className="text-right">
                <button
                  onClick={() =>
                    handleDeleteProcessStep(key, stepData.imageUrl)
                  }
                  className="text-red-500 hover:text-red-700">
                  Delete Section
                </button>
              </div>
            )}

            <div
              className={cn(
                'w-full h-[1px] bg-brown my-10',
                index === processSteps.length - 1 && 'hidden'
              )}></div>
          </div>
        ))}
      </div>

      {/* Add New Process Step Form */}
      {user.email && (
        <div className="w-10/12 mx-auto mb-10">
          <h3 className="mb-4 text-2xl font-medium">Add New Process Step</h3>
          <input
            type="text"
            placeholder="Title"
            value={newProcessStep.title}
            onChange={(e) =>
              setNewProcessStep({ ...newProcessStep, title: e.target.value })
            }
            className="w-full p-2 mb-4 border border-gray-300"
            disabled={loading} // Disable input when loading
          />
          <textarea
            placeholder="Description"
            value={newProcessStep.text}
            onChange={(e) =>
              setNewProcessStep({ ...newProcessStep, text: e.target.value })
            }
            className="w-full p-2 mb-4 border border-gray-300"
            disabled={loading} // Disable input when loading
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setNewProcessStep({ ...newProcessStep, image: file });
              }
            }}
            className="mb-4"
            disabled={loading} // Disable input when loading
          />
          <button
            onClick={handleAddNewProcessStep}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Adding...' : 'Add New Step'}
          </button>
        </div>
      )}
    </>
  );
};
