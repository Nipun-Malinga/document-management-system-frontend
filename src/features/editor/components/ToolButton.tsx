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
      className={`${active ? 'text-slate-900!' : 'text-slate-700!'}`}
    />
  );
};

export default ToolButton;
