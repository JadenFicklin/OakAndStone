import { cn } from 'utils/cn';

export const Title = ({ children, classname }) => {
  return (
    <>
      <div
        className={cn(
          'my-10 text-xl text-white md:text-xl h-11 md:h-12 place-content-center md:content-center md:justify-start md:pl-40 bg-brown sticky flex flex-wrap items-center top-10 md:top-[120px] xl:top-[132px] z-40',
          classname
        )}>
        {children}
      </div>
    </>
  );
};
