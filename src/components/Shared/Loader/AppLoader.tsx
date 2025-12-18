// src/components/shared/AppLoader.tsx
const AppLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Sphere */}
        <div className="relative h-20 w-20">
          {/* Center */}
          <span className="absolute inset-0 m-auto h-4 w-4 rounded-full bg-primary animate-pulse" />

          {/* Orbiting dots */}
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute top-1/2 left-1/2 h-3 w-3 rounded-full bg-primary/70"
              style={{
                transform: `rotate(${i * 60}deg) translate(32px)`,
                animation: "spin 1.6s linear infinite",
              }}
            />
          ))}
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            ClubSphere
          </h2>
          <p className="text-sm text-muted-foreground">
            Connecting communities...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
