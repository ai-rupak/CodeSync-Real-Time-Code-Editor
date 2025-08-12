import React from 'react';

// Mobile-Responsive Skeleton Loading Component
const ResponsiveEditorSkeleton = () => {
  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden font-mono animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-gray-800 border-b border-gray-700 p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile hamburger */}
            <div className="w-6 h-6 bg-gray-700 rounded md:hidden"></div>
            <div className="w-20 md:w-24 h-5 md:h-6 bg-gray-700 rounded"></div>
            {/* Room ID - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-12 h-4 bg-gray-700 rounded"></div>
              <div className="w-24 h-6 bg-gray-700 rounded"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-16 md:w-28 h-7 md:h-8 bg-gray-700 rounded-lg"></div>
            <div className="w-12 md:w-16 h-7 md:h-8 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </header>

      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">
        
        {/* Sidebar - Hidden on mobile, shows on desktop */}
        <aside className="hidden md:block w-64 bg-gray-800 border-r border-gray-700">
          <div className="p-4 h-full flex flex-col">
            {/* Room Info Skeleton */}
            <div className="mb-6">
              <div className="w-16 h-4 bg-gray-700 rounded mb-2"></div>
              <div className="w-full h-16 bg-gray-700 rounded-lg"></div>
            </div>

            {/* Users Skeleton */}
            <div className="mb-6">
              <div className="w-24 h-4 bg-gray-700 rounded mb-2"></div>
              <div className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-700 rounded-lg p-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-20 h-4 bg-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section Skeleton */}
            <div className="mt-auto space-y-3">
              <div>
                <div className="w-20 h-3 bg-gray-700 rounded mb-1"></div>
                <div className="w-full h-10 bg-gray-700 rounded-lg"></div>
              </div>
              <div className="w-full h-8 bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </aside>

        {/* Main Content - Responsive */}
        <main className="flex-1 flex flex-col min-h-0">
          {/* Mobile Room Info Bar - Only on mobile */}
          <div className="md:hidden bg-gray-800 border-b border-gray-700 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-8 h-3 bg-gray-700 rounded"></div>
                <div className="w-16 h-4 bg-gray-700 rounded"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-8 h-3 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>

          {/* Code Editor - Responsive height */}
          <div className="flex-1 border border-gray-500/20 rounded-lg m-2 md:m-4 mb-1 md:mb-2 overflow-hidden bg-black/20 min-h-0">
            <div className="w-full h-full bg-gray-800/50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-gray-500/20 border-t-gray-500 rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
                <div className="w-24 md:w-32 h-3 md:h-4 bg-gray-700 rounded mx-auto mb-1 md:mb-2"></div>
                <div className="w-16 md:w-24 h-2 md:h-3 bg-gray-700 rounded mx-auto"></div>
              </div>
            </div>
          </div>

          {/* Input/Output Console - Stack on mobile, side by side on desktop */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 p-2 md:p-4 pt-0">
            <div className="flex-1">
              <div className="w-8 md:w-12 h-3 md:h-4 bg-gray-700 rounded mb-2"></div>
              <div className="w-full h-20 md:h-32 bg-gray-700 rounded-lg"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 md:w-16 h-3 md:h-4 bg-gray-700 rounded"></div>
                <div className="w-6 md:w-10 h-2 md:h-3 bg-gray-700 rounded"></div>
              </div>
              <div className="w-full h-20 md:h-32 bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Only on mobile */}
      <div className="md:hidden bg-gray-800 border-t border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-6 bg-gray-700 rounded"></div>
          <div className="w-16 h-6 bg-red-600/50 rounded"></div>
        </div>
      </div>
    </div>
  );
};

// Demo component showing responsive behavior
const ResponsiveDemo = () => {
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState('mobile');
  
  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return <ResponsiveEditorSkeleton />;
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Responsive Editor Loaded!</h2>
        <p className="text-gray-400 mb-4">
          Resize your window or view on different devices to see the responsive behavior
        </p>
        
        {/* <div className="space-y-3">
          <button 
            onClick={() => setLoading(true)}
            className="block w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            Show Skeleton Again
          </button>
          
          <div className="text-sm text-gray-500">
            <p>✓ Mobile-first responsive design</p>
            <p>✓ Proper spacing and touch targets</p>
            <p>✓ Optimized layout for small screens</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ResponsiveDemo;