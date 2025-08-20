import { useMemo } from 'react';
import { Container, Theme } from './settings/types';
import KotoDashboard from './components/generated/KotoDashboard';

import { Toaster } from 'sonner';

let theme: Theme = 'light';
let container: Container = 'none';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  const generatedComponent = useMemo(() => {
    // THIS IS WHERE THE TOP LEVEL GENRATED COMPONENT WILL BE RETURNED!
    return <KotoDashboard />; // %EXPORT_STATEMENT%
  }, []);

  if (container === 'centered') {
    return (
      <>
        <div className="h-full w-full flex flex-col items-center justify-center">
          {generatedComponent}
        </div>
        <Toaster position="top-right" richColors />
      </>
    );
  } else {
    return (
      <>
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 100000 }}>
    
        </div>
        {generatedComponent}
        <Toaster position="top-right" richColors />
      </>
    );
  }
}

export default App;