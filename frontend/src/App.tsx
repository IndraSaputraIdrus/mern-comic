import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddPage from "./pages/AddPage";

const App = () => {
  const route = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/add", element: <AddPage /> },
  ]);

  return <RouterProvider router={route} />;
};

export default App;
