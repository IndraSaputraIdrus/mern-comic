import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Items from "../components/Items";
import clsx from "clsx";

export type Manga = {
  id: number;
  title: string;
  author: string;
  published_year: number;
  description: string;
  cover_img?: string | null;
};

type StateError = {
  error: boolean;
  message?: string;
};

const HomePage = () => {
  const [mangas, setMangas] = useState<Manga[] | null>(null);
  const [error, setError] = useState<StateError>({ error: false });

  const deleteManga = async (id: number) => {
    if (!id) return;
    if (!confirm("yakin?")) return;

    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/manga/${id}`
      );

      if (data.message !== "success") throw "Gagal Menghapus";
      alert(data.message);
    } catch (error: any) {
      alert(error);
    }
  };

  const getManga = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/mangas`
      );
      setMangas(data);
      setError({ error: false });
    } catch (error: any) {
      console.log(error);
      setError({ error: true, message: error?.message });
    }
  };

  useEffect(() => {
    getManga();
  }, [mangas]);

  return (
    <div>
      {error.error ? (
        <h1>{error.message}</h1>
      ) : (
        <div className={clsx("max-w-5xl mx-auto py-12")}>
          <Link
            to="/add"
            className={clsx(
              "inline-block",
              "bg-green-300 text-green-800",
              "px-10 py-2 mb-5",
              "rounded-lg",
              "hover:bg-green-400 text-green-900",
              "transition"
            )}
          >
            Add new manga
          </Link>
          <div className={clsx("-mx-4", "grid grid-cols-4 gap-y-10")}>
            {mangas?.map((item) => (
              <Items key={item.id} {...item} onDelete={deleteManga} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
