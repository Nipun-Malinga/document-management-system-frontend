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
      theme={active ? 'dark' : 'neutral'}
      disabled={disabled}
      onClick={onClick}
      className={`${active} ? 'text-gray-600!' : 'text-gray-200'`}
    />
  );
};

export default ToolButton;
