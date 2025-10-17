import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  title?: string;
  endpoint: string;
  children?: ReactNode;
  onClick?: () => void;
}

const Link = ({ title, endpoint, children, onClick }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLocation =
    location.pathname === endpoint ||
    location.pathname.startsWith(`${endpoint}/`);

  return (
    <div
      className={`mb-1.5 px-3 py-1 rounded-lg cursor-pointer flex flex-row items-center transition duration-100 ease-in-out ${
        isLocation ? 'bg-gray-200' : 'hover:bg-gray-200'
      }`}
      onClick={() => {
        onClick && onClick;
        navigate(endpoint);
      }}
    >
      {title && title}
      {children && children}
    </div>
  );
};

export default Link;
