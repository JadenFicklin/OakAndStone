import { cn } from 'utils/cn';

export const Title = ({ children, classname }) => {
  return (
    <>
      <div
        className={cn(
          'grid my-10 text-xl text-white md:text-xl h-11 md:h-12 place-content-center md:content-center md:justify-start md:pl-40 bg-brown',
          classname
        )}>
        {children}
      </div>
    </>
  );
};
