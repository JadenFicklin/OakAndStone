import { Link, useLocation } from 'react-router-dom';
import logo from 'assets/images/logo/logo.svg';
import { useState } from 'react';
import { cn } from 'utils/cn';
import { Drawer } from 'utils/Drawer';
import { useAtom } from 'jotai';
import { navAtom } from 'atoms/navAtom';

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useAtom(navAtom);
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  console.log(nav);

  return (
    <>
      {/* desktop */}
      <div className="sticky top-0 z-50 hidden w-full bg-white md:flex">
        <div className="flex flex-wrap items-center justify-between w-11/12 mx-auto">
          <Link to="/" onClick={scrollToTop} className="hidden md:block">
            <img
              alt="oak and stone logo"
              src={logo}
              className="h-12 xl:h-16 my-9"
            />
          </Link>
          <div className="relative flex p-3 my-3 text-xs uppercase text-brown">
            {navOptions.map((item, index) => {
              const isActive = location.pathname === item.link;

              return (
                <Link
                  to={item.link}
                  key={index}
                  onClick={() => {
                    setOpen(false);
                    scrollToTop();
                    setNav(item.text);
                  }}
                  className={cn(
                    'p-3 xl:px-10 hover:bg-brown hover:bg-opacity-5 duration-150',
                    isActive && 'bg-brown bg-opacity-10 duration-150'
                  )}>
                  {item.text}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className={cn('w-full h-11 bg-brown md:hidden sticky top-0 z-50')}>
        <div
          className={cn(
            'size-11 grid place-content-center cursor-pointer duration-200  mx-auto'
          )}
          onClick={() => setOpen(!open)}>
          <div
            className={cn(
              'w-5 h-[1px] bg-white my-[1.5px] duration-200 relative ',
              open && 'rotate-[-40deg] bottom-[-1.8px] w-5 md:bg-max'
            )}></div>
          <div
            className={cn(
              'w-5 h-[1px] bg-white my-[1.5px] duration-200',
              open && 'hidden'
            )}></div>
          <div
            className={cn(
              'w-5 h-[1px] bg-white my-[1.5px] duration-200 relative',
              open && 'rotate-[-135deg] bottom-[2.2px] w-5 md:bg-max'
            )}></div>
        </div>
      </div>
      <Link to="/" onClick={scrollToTop} className="md:hidden">
        <img
          alt="oak and stone logo"
          src={logo}
          className="h-16 mx-auto my-9"
        />
        <div className="w-10/12 h-[1px] bg-brown  mx-auto md:hidden"></div>
      </Link>
      <div className="sticky z-40 w-full bg-white shadow-2xl text-brown md:hidden top-11">
        <Drawer show={open} duration={'500'}>
          <div className="flex flex-col w-10/12 py-3 mx-auto text-xs divide-y divide-brown divide-opacity-10">
            <Link
              to="/"
              onClick={() => {
                setOpen(false);
                scrollToTop();
              }}
              className="py-3 ">
              Home
            </Link>
            {navOptions.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                onClick={() => {
                  setOpen(false);
                  scrollToTop();
                }}
                className="py-3">
                {item.text}
              </Link>
            ))}
          </div>
        </Drawer>
      </div>
    </>
  );
};

const navOptions = [
  {
    text: 'About',
    link: '/about'
  },
  {
    text: 'Gallery',
    link: '/gallery'
  },
  {
    text: 'Process',
    link: '/process'
  },
  {
    text: 'Careers',
    link: '/careers'
  },
  {
    text: 'Contact',
    link: '/contact'
  }
];
