import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostPage } from "./pages/PostPage";
import { useUiSettings } from "./context/UiSettingsContext.jsx";

function App() {
  const { settings } = useUiSettings();

  const appClassName =
    settings.theme === "light"
      ? "min-h-screen bg-slate-50 text-slate-900"
      : settings.theme === "purple"
        ? "min-h-screen bg-gradient-to-b from-[#050816] to-[#0b1120] text-slate-100"
        : "min-h-screen bg-slate-900 text-slate-100";

  return (
    <div className={appClassName}>
      <Navbar />
      <div className="container mx-auto px-4 py-6 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
