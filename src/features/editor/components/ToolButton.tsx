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
      className={`${active ? 'bg-slate-700 text-slate-300!' : 'text-slate-900!'}`}
    />
  );
};

export default ToolButton;
