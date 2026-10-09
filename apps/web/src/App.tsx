import { lazy, Suspense, useState } from 'react';
import { StartScreen } from './components/StartScreen';

const GameViewport = lazy(() => import('./components/GameViewport'));

export default function App() {
  const [playing, setPlaying] = useState(false);

  return (
    <main
      className="game-root"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      {playing ? (
        <Suspense fallback={<div className="game-loading">Loading District0…</div>}>
          <GameViewport />
        </Suspense>
      ) : (
        <StartScreen onStart={() => setPlaying(true)} />
      )}
    </main>
  );
}
