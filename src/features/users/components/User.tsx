interface Props {
  userId: number;
}

const User = ({ userId }: Props) => {
  return (
    <div
      style={generateRandomRgbColor()}
      className=' w-6 h-6 rounded-full border border-gray- dark:border-gray-300 flex justify-center items-center'
    >
      <p className='text-xs text-white font-medium pt-0.5'>{userId}</p>
    </div>
  );
};

function generateRandomRgbColor(): React.CSSProperties {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return {
    background: `rgb(${r}, ${g}, ${b})`,
  };
}

export default User;
