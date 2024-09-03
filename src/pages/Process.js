import { Title } from 'components/Title';
import { cn } from 'utils/cn';
import { EditableText } from 'utils/EditableText';
import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

export const Process = () => {
  const [processData, setProcessData] = useState([]);

  useEffect(() => {
    const fetchProcessData = async () => {
      const db = getDatabase();
      const processPageDataRef = ref(db, 'processPageData');
      const snapshot = await get(processPageDataRef);
      if (snapshot.exists()) {
        setProcessData(snapshot.val());
      } else {
        console.log('No data available');
      }
    };

    fetchProcessData();
  }, []);

  return (
    <>
      <Title>Our process</Title>

      <div className="w-8/12 py-10 pb-20 mx-auto text-center">
        <EditableText
          firebasePath="titles/process"
          className="text-3xl md:text-6xl text-brown playfair"
        />
      </div>

      <div className="grid w-10/12 mx-auto mb-20 lg:w-8/12 gap-y-6 text-brown">
        {processData.map((item, index) => (
          <div key={index}>
            <div className="grid gap-y-6 lg:grid-cols-2 lg:items-center">
              <EditableText
                firebasePath={`processPageData/${index}/title`}
                className="text-3xl lg:hidden"
              />
              <img
                src={item.image}
                alt={item.title}
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
            <div
              className={cn(
                'w-full h-[1px] bg-brown my-10',
                index === processData.length - 1 && 'hidden'
              )}></div>
          </div>
        ))}
      </div>
    </>
  );
};
