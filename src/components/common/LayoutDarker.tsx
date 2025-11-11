interface Props {
  collapsed: boolean;
  onClick?: () => void;
}

const LayoutDarker = ({ collapsed, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`absolute z-15 md:cursor-pointer w-full h-full ${
        !collapsed
          ? 'inset-0 bg-black/20 transition-all duration-200 ease-linear pointer-events-auto backdrop-blur-xs'
          : 'pointer-events-none'
      }`}
    />
  );
};

export default LayoutDarker;
