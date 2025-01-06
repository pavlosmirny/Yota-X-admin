// src/App.tsx
import { ThemeProvider } from "./theme/ThemeProvider";
import {
  HashRouter as Router, // Использование HashRouter для корректной маршрутизации на GitHub Pages
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { ArticlesList } from "./pages/articles/ArticlesList";
import { ArticleForm } from "./pages/articles/ArticleForm";
import PositionsList from "./pages/positions/PositionsList";
import PositionForm from "./pages/positions/PositionForm";
import PositionDetails from "./components/PositionDetails";
// Импортируйте другие страницы по мере необходимости

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            {/* Перенаправление с корня на Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Пример добавления Dashboard маршрута */}
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}

            {/* Маршруты для статей */}
            <Route path="/articles" element={<ArticlesList />} />
            <Route path="/articles/create" element={<ArticleForm />} />
            <Route path="/articles/edit/:slug" element={<ArticleForm />} />

            {/* Маршруты для позиций */}
            <Route path="/positions" element={<PositionsList />} />
            <Route path="/positions/new" element={<PositionForm />} />
            <Route path="/positions/:id" element={<PositionDetails />} />
            <Route path="/positions/:id/edit" element={<PositionForm />} />

            {/* Добавьте другие маршруты здесь */}
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
