export const Title = ({ children }) => {
  return (
    <>
      <div className="grid my-10 text-xl text-white md:text-2xl h-11 md:h-16 place-content-center md:content-center md:justify-start md:pl-40 bg-brown">
        {children}
      </div>
    </>
  );
};
