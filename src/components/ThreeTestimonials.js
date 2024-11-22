import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { cn } from 'utils/cn';
import { getDatabase, ref, get, remove, push } from 'firebase/database';
import { EditableText } from 'utils/EditableText';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';

export const ThreeTestimonials = () => {
  const [startIndex, setStartIndex] = useState(0);
  const displayCount = 3;
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTestimonial, setNewTestimonial] = useState({
    color: 'bg-blue-500',
    name: '',
    text: ''
  });
  const [user] = useAtom(userAtom);

  // Fetch testimonials from Firebase Realtime Database
  useEffect(() => {
    const fetchTestimonials = async () => {
      const db = getDatabase();
      const testimonialsRef = ref(db, 'homePageData/homeTestimonials');
      const snapshot = await get(testimonialsRef);
      if (snapshot.exists()) {
        const testimonialsObj = snapshot.val();
        // Convert object to array of key-value pairs [{key, value}]
        const testimonialsArray = Object.keys(testimonialsObj).map((key) => ({
          id: key,
          ...testimonialsObj[key]
        }));
        setTestimonialsData(testimonialsArray);
      } else {
        console.log('No testimonials data available');
      }
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  const handleLeftClick = () => {
    setStartIndex((prevIndex) => {
      return prevIndex === 0
        ? testimonialsData.length - displayCount
        : prevIndex - 1;
    });
  };

  const handleRightClick = () => {
    setStartIndex((prevIndex) => {
      return prevIndex === testimonialsData.length - displayCount
        ? 0
        : prevIndex + 1;
    });
  };

  // Delete a testimonial using its Firebase key
  const handleDeleteTestimonial = async (id) => {
    const db = getDatabase();
    const testimonialRef = ref(db, `homePageData/homeTestimonials/${id}`);
    await remove(testimonialRef);
    setTestimonialsData((prev) =>
      prev.filter((testimonial) => testimonial.id !== id)
    );
  };

  // Add a new testimonial
  const handleAddTestimonial = async () => {
    const db = getDatabase();
    const testimonialsRef = ref(db, 'homePageData/homeTestimonials');
    await push(testimonialsRef, newTestimonial);
    setNewTestimonial({
      color: 'bg-blue-500',
      name: '',
      text: ''
    });
    const snapshot = await get(testimonialsRef); // Refetch testimonials
    const testimonialsObj = snapshot.val();
    const testimonialsArray = Object.keys(testimonialsObj).map((key) => ({
      id: key,
      ...testimonialsObj[key]
    }));
    setTestimonialsData(testimonialsArray);
  };

  // Adjust testimonials to display
  const testimonialsToDisplay = testimonialsData.slice(
    startIndex,
    startIndex + displayCount
  );

  if (testimonialsToDisplay.length < displayCount) {
    testimonialsToDisplay.push(
      ...testimonialsData.slice(0, displayCount - testimonialsToDisplay.length)
    );
  }

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="relative hidden xxl:block text-brown">
      <h2 className="w-full my-20 mt-32 text-4xl text-center">Testimonials</h2>

      <div className="relative flex justify-between mx-auto space-x-4 w-max">
        <div
          className="absolute top-0 grid content-center h-full cursor-pointer -left-7 w-max"
          onClick={handleLeftClick}>
          <FaChevronLeft className="m-3 size-5" />
        </div>
        {testimonialsToDisplay.map((item, index) => (
          <div
            key={item.id} // Use Firebase ID as key
            className="border-[1px] rounded-md border-opacity-25 p-10 w-[400px] min-h-[320px] h-max text-center relative">
            <div
              className={cn(
                item.color,
                'rounded-full w-10 h-10 flex items-center justify-center mx-auto absolute top-0 text-xl text-white -translate-y-1/2 left-1/2 -translate-x-1/2 select-none'
              )}>
              {item.name[0]}
            </div>
            {/* Editable Name */}
            <EditableText
              firebasePath={`homePageData/homeTestimonials/${item.id}/name`}
              className="mb-4 font-bold"
            />

            {/* Editable Text */}
            <EditableText
              firebasePath={`homePageData/homeTestimonials/${item.id}/text`}
              className="py-3 text-sm"
            />

            {/* Delete button */}
            {user.email && (
              <button
                onClick={() => handleDeleteTestimonial(item.id)}
                className="absolute px-4 py-1 text-white bg-red-500 rounded bottom-2 right-2">
                Delete
              </button>
            )}
          </div>
        ))}
        <div
          className="absolute top-0 grid content-center h-full cursor-pointer -right-11 w-max"
          onClick={handleRightClick}>
          <FaChevronRight className="m-3 size-5" />
        </div>
      </div>

      {/* Form to add a new testimonial */}
      {user.email && (
        <div className="mt-10">
          <h3 className="mb-4 text-2xl text-center">Add a New Testimonial</h3>
          <div className="flex flex-col items-center space-y-4">
            <select
              value={newTestimonial.color}
              onChange={(e) =>
                setNewTestimonial((prev) => ({
                  ...prev,
                  color: e.target.value
                }))
              }
              className="px-4 py-2 border rounded">
              <option value="bg-blue-500">Blue</option>
              <option value="bg-yellow-500">Yellow</option>
              <option value="bg-orange-500">Orange</option>
              <option value="bg-green-500">Green</option>
              <option value="bg-purple-500">Purple</option>
            </select>

            <input
              type="text"
              placeholder="Name"
              value={newTestimonial.name}
              onChange={(e) =>
                setNewTestimonial((prev) => ({ ...prev, name: e.target.value }))
              }
              className="px-4 py-2 border rounded w-[300px]"
            />

            <textarea
              placeholder="Testimonial text"
              value={newTestimonial.text}
              onChange={(e) =>
                setNewTestimonial((prev) => ({ ...prev, text: e.target.value }))
              }
              className="px-4 py-2 border rounded w-[300px] h-[100px]"></textarea>

            <button
              onClick={handleAddTestimonial}
              className="px-6 py-2 text-white bg-green-500 rounded">
              Add Testimonial
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
