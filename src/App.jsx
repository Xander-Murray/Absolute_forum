import { Routes, Route } from "react-router";
import { Home } from "./pages/Home.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { CreatePostPage } from "./pages/CreatePostPage.jsx";

export default function App() {
  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
        </Routes>
      </div>
    </div>
  );
}
