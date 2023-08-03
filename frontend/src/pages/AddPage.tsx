import clsx from "clsx";
import { Manga } from "./HomePage";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Manga>({
    id: 0,
    title: "",
    author: "",
    description: "",
    published_year: 0,
  });
  const [image, setImage] = useState<Blob | string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? e.target.files[0] : "";
    setImage(files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newFormData = new FormData();
      newFormData.append("cover_img", image);
      newFormData.append("title", formData.title);
      newFormData.append("author", formData.author);
      newFormData.append("published_year", formData.published_year.toString());
      newFormData.append("description", formData.description);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/mangas`,
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.message !== "success") throw Error(data.message);
      return navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={clsx("max-w-md mx-auto", "py-16 px-5", "text-center")}>
      <h1 className={clsx("font-semibold", "text-5xl")}>Add new manga</h1>
      <form
        onSubmit={handleSubmit}
        className={clsx("flex flex-col justify-center", "space-y-4", "mt-10")}
      >
        <input
          className={clsx(
            "border focus:border-blue-500",
            "rounded",
            "px-3 py-1",
            "outline-none"
          )}
          placeholder="Title"
          required
          name="title"
          value={formData.title}
          onChange={handleChange}
          autoFocus
        />
        <input
          className={clsx(
            "border focus:border-blue-500",
            "rounded",
            "px-3 py-1",
            "outline-none"
          )}
          placeholder="Author"
          required
          name="author"
          value={formData.author}
          onChange={handleChange}
        />
        <input
          className={clsx(
            "border focus:border-blue-500",
            "rounded",
            "px-3 py-1",
            "outline-none"
          )}
          type="number"
          required
          name="published_year"
          placeholder="Published Year"
          value={formData.published_year > 0 ? formData.published_year : ""}
          onChange={handleChange}
        />
        <input
          className={clsx(
            "border focus:border-blue-500",
            "rounded",
            "outline-none",
            "relative",
            "file:transition",
            "text-gray-400",
            "file:bg-gray-200 file:text-gray-400 file:border-none file:outline-none",
            "file:px-3 file:py-1 file:mr-3",
            "file:hover:bg-gray-300 file:hover:text-gray-100",
            "disabled:opacity-30"
          )}
          type="file"
          required
          accept="image/*"
          placeholder="Image Cover"
          name="cover_img"
          onChange={handleChangeImage}
        />
        <textarea
          className={clsx(
            "border focus:border-blue-500",
            "rounded",
            "px-3 py-1",
            "outline-none",
            "h-40",
            "resize-x-none"
          )}
          required
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <button
          type="submit"
          className={clsx(
            "bg-blue-200 text-blue-600",
            "py-2",
            "font-semibold",
            "rounded",
            "border border-blue-200",
            "focus:outline-none focus:border-blue-500 hover:bg-blue-300 active:bg-blue-400"
          )}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPage;
