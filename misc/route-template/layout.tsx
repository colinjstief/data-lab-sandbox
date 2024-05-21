const RouteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <h2>Common route header</h2>
      {children}
    </div>
  );
};

export default RouteLayout;
