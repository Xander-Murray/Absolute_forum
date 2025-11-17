import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUiSettings } from "../context/UiSettingsContext.jsx";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signinWithGitHub, signOut, user } = useAuth();
  const { settings, updateSettings } = useUiSettings();

  const displayName =
    user?.user_metadata?.user_name ??
    user?.user_metadata?.full_name ??
    user?.email ??
    "Guest";

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            Absolute<span className="text-purple-500">.forum</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Post
            </Link>
          </div>

          {/* Desktop Right: UI settings + auth */}
          <div className="hidden md:flex items-center space-x-6">
            {/* UI customization controls */}
            <div className="flex flex-col items-start text-xs text-gray-300 gap-1">
              <div className="flex items-center gap-2">
                <span>Theme:</span>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSettings({ theme: e.target.value })}
                  className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="purple">Purple</option>
                </select>
              </div>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={settings.showContent}
                  onChange={(e) =>
                    updateSettings({ showContent: e.target.checked })
                  }
                />
                <span>Show content</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={settings.showImage}
                  onChange={(e) =>
                    updateSettings({ showImage: e.target.checked })
                  }
                />
                <span>Show image</span>
              </label>
            </div>

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300 text-sm">{displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500 px-3 py-1 rounded text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signinWithGitHub}
                className="bg-blue-500 px-3 py-1 rounded text-sm"
              >
                Sign in with GitHub
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
          <div className="px-4 pt-3 pb-4 space-y-3 text-sm">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 rounded-md font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              Create Post
            </Link>

            <div className="border-t border-white/10 pt-3 space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <span>Theme:</span>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSettings({ theme: e.target.value })}
                  className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="purple">Purple</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.showContent}
                  onChange={(e) =>
                    updateSettings({ showContent: e.target.checked })
                  }
                />
                <span>Show content</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.showImage}
                  onChange={(e) =>
                    updateSettings({ showImage: e.target.checked })
                  }
                />
                <span>Show image</span>
              </label>
            </div>

            <div className="border-t border-white/10 pt-3">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{displayName}</span>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="bg-red-500 px-3 py-1 rounded text-xs"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signinWithGitHub();
                    setMenuOpen(false);
                  }}
                  className="bg-blue-500 px-3 py-1 rounded text-xs w-full"
                >
                  Sign in with GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
