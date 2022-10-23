const Card = ({ title, total }) => {
  return (
    <div className="flex items-center p-4 bg-emerald-500 rounded-lg shadow-sm">
      <div className="p-3 mr-4 text-green-500 bg-white rounded-full ">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
      <div>
        <p className="mb-2 text-lg font-medium text-white">{title}</p>
        <p className="text-lg font-semibold text-white">{total}</p>
      </div>
    </div>
  );
};

export default Card;
