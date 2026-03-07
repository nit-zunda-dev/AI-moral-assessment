import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from '@/contexts/GameContext';
import { LandingPage, DailyPage, ResultPage } from '@/pages';

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/daily" element={<DailyPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
