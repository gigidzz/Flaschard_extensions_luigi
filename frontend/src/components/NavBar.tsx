import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className='flex bg-green-400'>
      <ul className='flex space-x-5'>
        <li>
          <NavLink to="/" 
            className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/practice"
            className={({ isActive }) => isActive ? "active" : ""}>
            Practice
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;