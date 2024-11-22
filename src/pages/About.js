import { Title } from 'components/Title';
import { useFirebaseImage } from 'utils/useFirebaseImage';
import {
  getDatabase,
  ref,
  set,
  remove,
  push,
  onValue
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { EditableText } from 'utils/EditableText';

export const About = () => {
  const { imageUrl: teamImageUrl, UploadButton: UploadTeamImageButton } =
    useFirebaseImage('images/about/team.jpg');
  const [user] = useAtom(userAtom);
  const [aboutPeople, setAboutPeople] = useState([]);
  const [, setAboutHeaderData] = useState({});
  const [newPerson, setNewPerson] = useState({
    name: '',
    text: '',
    image: null
  });

  const db = getDatabase();
  const storage = getStorage();

  // Fetch about header data and people data from Firebase
  useEffect(() => {
    const fetchAboutData = () => {
      const aboutHeaderRef = ref(db, 'aboutPageData/aboutHeaderData');
      const aboutPeopleRef = ref(db, 'aboutPageData/aboutPeopleData');

      // Listen to changes in aboutHeaderData
      onValue(aboutHeaderRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAboutHeaderData(data);
        }
      });

      // Listen to changes in aboutPeopleData
      onValue(aboutPeopleRef, (snapshot) => {
        const peopleData = snapshot.val();
        if (peopleData) {
          const peopleArray = Object.keys(peopleData).map((key) => ({
            key,
            ...peopleData[key]
          }));
          setAboutPeople(peopleArray);
        }
      });
    };

    fetchAboutData();
  }, [db]);

  // Handle adding a new person
  const handleAddPerson = async () => {
    if (!newPerson.name || !newPerson.text || !newPerson.image)
      return alert('Please fill in all fields.');

    // Upload image to Firebase Storage
    const imageRef = storageRef(
      storage,
      `images/aboutPeople/${newPerson.image.name}`
    );
    await uploadBytes(imageRef, newPerson.image);
    const imageUrl = await getDownloadURL(imageRef);

    // Add new person data to Firebase Database
    const newPersonRef = push(ref(db, 'aboutPageData/aboutPeopleData'));
    await set(newPersonRef, {
      name: newPerson.name,
      text: newPerson.text,
      image: imageUrl
    });

    // Clear input fields
    setNewPerson({ name: '', text: '', image: null });
  };

  // Handle deleting a person
  const handleDeletePerson = async (personKey) => {
    const personRef = ref(db, `aboutPageData/aboutPeopleData/${personKey}`);
    await remove(personRef);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewPerson({ ...newPerson, image: e.target.files[0] });
    }
  };

  return (
    <div className="text-brown">
      <Title>About</Title>

      <h2 className="w-10/12 py-10 mx-auto text-3xl text-center md:text-6xl text-brown playfair">
        <EditableText
          firebasePath="aboutPageData/aboutHeaderData/title"
          className="text-3xl text-center md:text-6xl playfair"
        />
      </h2>

      <div className="grid w-10/12 mx-auto xl:my-20 xl:grid-cols-2 gap-y-6 ">
        <div className="grid mx-auto h-max gap-y-6 xl:w-10/12 xl:text-xl xl:order-1">
          <p>
            <EditableText
              firebasePath="aboutPageData/aboutHeaderData/text"
              className="text-base xl:text-xl"
            />
            <br />
            <EditableText
              firebasePath="aboutPageData/aboutHeaderData/text2"
              className="text-base xl:text-xl"
            />
            <br />
            <EditableText
              firebasePath="aboutPageData/aboutHeaderData/text3"
              className="text-base xl:text-xl"
            />
          </p>
        </div>

        <div className="relative xl:order-2">
          {teamImageUrl ? (
            <img
              src={teamImageUrl}
              alt="oak and stone team building their warehouse"
              className="object-cover my-6 xl:h-full xl:my-0"
            />
          ) : (
            <div className="flex items-center justify-center object-cover my-6 bg-gray-200 xl:h-full xl:my-0"></div>
          )}
          {user.email && <UploadTeamImageButton />}
        </div>
      </div>

      <div className="w-10/12 mx-auto h-[1px] my-20 bg-brown"></div>

      {/* Display existing people sections */}
      {aboutPeople.map((item, index) => (
        <div
          key={item.key}
          className="grid w-10/12 grid-cols-1 mx-auto my-6 mb-20 xl:text-xl xl:grid-cols-2 gap-y-6 xl:gap-x-20 h-max">
          <img
            src={item.image}
            alt={item.name}
            className="object-cover object-left my-6 bg-no-repeat bg-cover xl:my-0 xl:h-full"
          />
          <div className="grid gap-y-6 h-max">
            <h2 className="text-2xl font-medium text-left xl:text-2xl">
              {item.name}
            </h2>
            {/* Render text with line breaks */}
            <p>
              {item.text.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>

            {/* Delete button, only visible if the user is logged in */}
            {user.email && (
              <button
                onClick={() => handleDeletePerson(item.key)}
                className="text-red-500 hover:text-red-700">
                Delete
              </button>
            )}
          </div>
        </div>
      ))}

      {/* If the user is logged in, show the add new person form */}
      {user.email && (
        <div className="w-10/12 mx-auto">
          <h3 className="mb-4 text-2xl font-medium">Add New Person</h3>
          <input
            type="text"
            placeholder="Name"
            value={newPerson.name}
            onChange={(e) =>
              setNewPerson({ ...newPerson, name: e.target.value })
            }
            className="w-full p-2 mb-4 border border-gray-300"
          />
          <textarea
            placeholder="Text"
            value={newPerson.text}
            onChange={(e) =>
              setNewPerson({ ...newPerson, text: e.target.value })
            }
            className="w-full p-2 mb-4 border border-gray-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          <button
            onClick={handleAddPerson}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
            Add Person
          </button>
        </div>
      )}
    </div>
  );
};
