import type { IconType } from 'react-icons';

interface props {
  title?: string;
  type: 'button' | 'reset' | 'submit';
  icon?: IconType;
  onClick: () => void;
}

const Button = ({ title, type, icon: Icon, onClick }: props) => {
  return (
    <button
      type={type}
      onClick={() => onClick()}
      className='bg-gray-800 text-white text-xs md:text-lg px-2 py-1 flex items-center justify-center gap-x-2 rounded-sm cursor-pointer transition duration-100 ease-in-out hover:bg-gray-600 active:bg-gray-800'
    >
      {Icon && <Icon />}
      {title && title}
    </button>
  );
};

export default Button;
