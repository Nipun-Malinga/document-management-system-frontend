interface Props {
  collapsed: boolean;
  onClick?: () => void;
}

const LayoutDarker = ({ collapsed, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`fixed z-15 md:cursor-pointer w-full h-dvh ${
        !collapsed
          ? 'inset-0 bg-black/70 transition-all duration-200 ease-linear pointer-events-auto'
          : 'pointer-events-none'
      }`}
    />
  );
};

export default LayoutDarker;
