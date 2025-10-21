import { useMemo } from 'react';
import KotoDashboard from './components/generated/KotoDashboard';
import { Toaster } from 'sonner';

function App() {
  const generatedComponent = useMemo(() => <KotoDashboard />, []);
  return (
    <>
      {generatedComponent}
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
