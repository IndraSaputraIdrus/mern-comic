import { Manga } from "../pages/HomePage";
import { useEffect, useState } from "react";

type ItemsProps = Manga & {
  onDelete: (id: number) => void;
};

const Items: React.FC<ItemsProps> = ({ id, title, cover_img, onDelete }) => {
  const [image, setImage] = useState("https://fakeimg.pl/100x150");

  const truncate = (string: string, number: number) => {
    if (string.length < number) return string;
    return string.slice(0, number) + "...";
  };

  useEffect(() => {
    setImage(`http://localhost:3000/uploads/${cover_img}`);
  }, []);

  return (
    <div className="p-4 flex flex-col group space-y-3">
      <div className="flex-auto rounded-md overflow-hidden shadow-md">
        <img
          src={image}
          className="h-full w-full object-cover group-hover:opacity-80"
        />
      </div>
      <h1 className="h-14 text-center font-semibold text-lg group-hover:text-black/80">
        {truncate(title, 40)}
      </h1>
      <div className="flex items-center mx-auto space-x-3">
        <button className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-700 transition">
          Detail
        </button>
        <button
          onClick={() => onDelete(id)}
          className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Items;
