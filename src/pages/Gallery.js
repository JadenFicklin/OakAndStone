import { galleryAtom } from 'atoms/galleryAtom';
import { Title } from 'components/Title';
import { galleryData } from 'data/Gallery';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';

export const Gallery = () => {
  const [, setGallery] = useAtom(galleryAtom);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Title>Gallery</Title>
      <h2 className="w-10/12 py-10 mx-auto text-3xl text-center md:text-6xl text-brown playfair">
        Crafting Excellence: Explore Our Portfolio of Custom Woodwork and
        Designs
      </h2>
      <div className="flex flex-wrap items-start justify-center w-9/12 gap-10 pb-10 mx-auto my-20 text-white xl:py-10 xl:pb-20 ">
        {galleryData.map((item, index) => (
          <Link
            key={index}
            to={`/gallery/${item.slug}`}
            className="object-cover bg-center size-64 w-full md:w-[240px] relative hover:scale-105 duration-150 cursor-pointer"
            style={{
              backgroundImage: `url(${item.image})`
            }}
            onClick={() => {
              setGallery(item.link);
              scrollToTop();
            }}>
            <div className="absolute w-11/12 p-2 text-lg text-white bg-black bottom-10 bg-opacity-60 h-max">
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
