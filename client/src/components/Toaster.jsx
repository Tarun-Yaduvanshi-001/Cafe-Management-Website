import React from 'react';
import { Toaster } from 'sonner';

const ThemedToaster = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        // These styles will match your application's dark theme
        style: {
          background: 'oklch(0.05 0 0)',
          borderColor: 'oklch(0.15 0 0)',
          color: 'oklch(0.98 0 0)',
        },
      }}
    />
  );
};

export default Toaster;