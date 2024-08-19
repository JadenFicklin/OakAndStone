import { galleryAtom } from 'atoms/galleryAtom';
import { Title } from 'components/Title';
import { galleryData } from 'data/Gallery';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';

export const Gallery = () => {
  const [gallery, setGallery] = useAtom(galleryAtom);
  console.log(gallery);
  return (
    <>
      <Title>Gallery</Title>
      <h2 className="w-10/12 mx-auto text-6xl text-center text-brown playfair">
        Crafting Excellence: Explore Our Portfolio of Custom Woodwork and
        Designs
      </h2>
      <div className="flex flex-wrap items-start justify-center w-9/12 gap-10 py-10 mx-auto -mt-10 text-white xl:py-32 ">
        {galleryData.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="object-cover bg-center size-64 w-[240px] relative hover:scale-105 duration-150 cursor-pointer"
            style={{
              backgroundImage: `url(${item.image})`
            }}
            onClick={() => setGallery(item.link)}>
            <div className="absolute w-11/12 p-2 text-lg text-white bg-black bottom-10 bg-opacity-60 h-max">
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
