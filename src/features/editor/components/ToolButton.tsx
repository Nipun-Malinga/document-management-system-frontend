import type { IconType } from 'react-icons';
import { Button } from '../../../components';

interface Props {
  icon: IconType;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const ToolButton = ({ icon, active, disabled, onClick }: Props) => {
  return (
    <Button
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      className={`${
        active
          ? 'bg-gray-300 dark:bg-gray-400 text-slate-300!'
          : 'text-slate-900!'
      }`}
    />
  );
};

export default ToolButton;
