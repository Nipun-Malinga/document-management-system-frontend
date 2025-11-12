import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
  title?: string;
  endpoint: string;
  children?: ReactNode;
  onClick?: () => void;
}

const NavItem = ({ title, endpoint, children, onClick }: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive =
    location.pathname === endpoint ||
    location.pathname.startsWith(`/dashboard/${endpoint}`);

  return (
    <div
      role='button'
      tabIndex={0}
      className={`mb-1.5 px-3 py-1 rounded-lg cursor-pointer flex items-center transition duration-100 ease-in-out ${
        isActive
          ? 'bg-gray-300 dark:bg-gray-700'
          : 'hover:bg-gray-300 hover:dark:bg-gray-600'
      }`}
      onClick={() => {
        onClick?.();
        navigate(`/dashboard/${endpoint}`);
      }}
    >
      {title && <span>{title}</span>}
      {children}
    </div>
  );
};

export default NavItem;
