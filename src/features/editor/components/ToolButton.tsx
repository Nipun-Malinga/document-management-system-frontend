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
      theme={active ? 'neutral' : 'common'}
      disabled={disabled}
      onClick={onClick}
      className={`${active ? 'text-gray-900!' : 'text-gray-700!'}`}
    />
  );
};

export default ToolButton;
