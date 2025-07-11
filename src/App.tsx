import { MainLayout } from '@components/MainLayout';
import { GeneratePage } from '@pages/Generate';
import { HistoryPage } from '@pages/History';
import { HomePage } from '@pages/Home';
import { Route, Routes } from 'react-router-dom';

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/generate" element={<GeneratePage />} />
                <Route path="/history" element={<HistoryPage />} />
            </Route>
        </Routes>
    );
}

export default App;
