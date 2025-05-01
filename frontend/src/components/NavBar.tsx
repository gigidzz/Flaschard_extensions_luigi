import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Practice', path: '/practice' },
];

function Navbar() {
  return (
    <nav className="bg-blue-100 border-b-2 border-black shadow-lg">
      <ul className="flex w-full max-w-6xl mx-auto space-x-4 items-center text-lg md:text-xl px-4 py-6">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `px-6 py-2 rounded-lg font-medium transition duration-200 ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-black'
                }`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
