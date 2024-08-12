import { Link } from 'react-router-dom';

export const Nav = () => {
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

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {navOptions.map((item) => (
          <Link to={item.link} className="mx-2">
            {item.text}
          </Link>
        ))}
      </nav>
    </>
  );
};
