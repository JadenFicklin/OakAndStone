import { cn } from 'utils/cn';

export const Title = ({ children, classname }) => {
  return (
    <>
      <div
        className={cn(
          ' text-sm text-white md:text-xl h-8 md:h-12 place-content-center md:content-center md:justify-start md:pl-40 bg-[#332311] sticky flex flex-wrap items-center top-[44px] md:top-[64px] z-40',
          classname
        )}>
        {children}
      </div>
    </>
  );
};
