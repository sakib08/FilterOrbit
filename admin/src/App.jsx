import AdminLayout from "./components/AdminLayout";
import FilterDesigner from "./pages/FilterDesigner";
import Settings from "./pages/Settings";
import AISettings from "./pages/AISettings";
import LanguageSettings from "./pages/LanguageSettings";

function renderPage(page) {
  switch (page) {
    case "settings":
      return <Settings />;
    case "ai":
      return <AISettings />;
    case "language":
      return <LanguageSettings />;
    default:
      return <FilterDesigner />;
  }
}

export default function App({ page }) {
  return (
    <AdminLayout page={page}>
      {renderPage(page)}
    </AdminLayout>
  );
}
