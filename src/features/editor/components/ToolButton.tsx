import { useSlate } from 'slate-react';
import { Button } from '../../../components';
import type { ToolBarButton } from '../types';
import { isMarkActive, toggleMark } from '../utils';

interface Props {
  props: ToolBarButton;
}

const ToolButton = ({ props }: Props) => {
  const editor = useSlate();

  return (
    <Button
      icon={props.icon}
      theme={isMarkActive(editor, props.action) ? 'dark' : 'common'}
      onClick={() => {
        toggleMark(editor, props.action);
      }}
    />
  );
};

export default ToolButton;
