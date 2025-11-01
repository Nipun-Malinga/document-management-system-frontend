import type { IconType } from 'react-icons';
import { Button } from '../../../components';
import type { ThemeVariant } from '../../../themes/themes';

interface Props {
  icon: IconType;
  theme: ThemeVariant;
  onClick: () => void;
}

const ToolButton = ({ icon, theme, onClick }: Props) => {
  return <Button icon={icon} theme={theme} onClick={onClick} className='text-gray-600!' />;
};

export default ToolButton;
