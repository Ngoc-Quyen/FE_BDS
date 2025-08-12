import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import ListPage from './pages/List/ListPage';
import DetailPage from './pages/Detail/DetailPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-gray-900">
                <Navbar />

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/list" element={<ListPage />} />
                    <Route path="/detail/:id" element={<DetailPage />} />
                    {/* Create/Edit pages to be implemented in next steps */}
                </Routes>

                <footer className="mt-12 border-t bg-white">
                    <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 text-center">
                        © {new Date().getFullYear()} テスト - CRUD BDS - チャン・ティ・ゴック・クエ
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
