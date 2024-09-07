import { useState, useEffect } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';

export const EditableText = ({
  firebasePath,
  className,
  inputClassName,
  buttonClassName
}) => {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState('');
  const [user] = useAtom(userAtom);

  useEffect(() => {
    const fetchText = async () => {
      const db = getDatabase();
      const textRef = ref(db, firebasePath);
      const snapshot = await get(textRef);
      if (snapshot.exists()) {
        setText(snapshot.val());
        setNewText(snapshot.val());
      } else {
        console.log('No data available');
      }
    };

    fetchText();
  }, [firebasePath]);

  const handleTextClick = () => {
    if (user?.email) {
      setIsEditing(true);
    } else {
      console.log('User is not logged in');
    }
  };

  const handleInputChange = (e) => {
    setNewText(e.target.value);
  };

  const handleSubmit = async () => {
    const db = getDatabase();
    const textRef = ref(db, firebasePath);

    await set(textRef, newText);

    setText(newText);
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <div className="w-full text-center">
          <input
            type="text"
            value={newText}
            onChange={handleInputChange}
            className={
              inputClassName ||
              `w-full text-center border-2 text-brown playfair border-brown `
            }
          />
          <button
            onClick={handleSubmit}
            className={
              buttonClassName ||
              'px-4 py-2 mt-4 text-lg text-white rounded bg-brown'
            }>
            Submit
          </button>
        </div>
      ) : (
        <h2
          className={` ${className}`}
          onClick={handleTextClick}
          style={{ cursor: user?.email ? 'pointer' : 'default' }}>
          {text || 'Loading...'}
        </h2>
      )}
    </>
  );
};
