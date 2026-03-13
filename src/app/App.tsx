import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';
import logoImg from '../assets/logo.png';

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1200);
    const t2 = setTimeout(onDone, 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <img
        src={logoImg}
        alt="不上班"
        className="h-16 w-auto animate-[splash-bounce_1s_ease-in-out]"
      />
      <p className="mt-3 text-sm text-muted-foreground animate-[splash-fade_0.8s_ease-in_0.3s_both]">
        自由工作，快乐生活
      </p>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <Toaster position="top-right" richColors />
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
