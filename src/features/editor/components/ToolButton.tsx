import { useSlate } from 'slate-react';
import { Button } from '../../../components';
import type { ToolBarButton } from '../types';
import { isMarkActive } from '../utils';

interface Props {
  props: ToolBarButton;
  onClick: () => void;
}

const ToolButton = ({ props, onClick }: Props) => {
  const editor = useSlate();

  return (
    <Button
      icon={props.icon}
      theme={isMarkActive(editor, props.action) ? 'dark' : 'common'}
      onClick={onClick}
    />
  );
};

export default ToolButton;
