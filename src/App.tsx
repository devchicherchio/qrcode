import React from "react";
import PageShell from "./components/PageShell";
import AppRouter from "./router";

const App: React.FC = () => {
  return (
    <PageShell>
      <AppRouter />
    </PageShell>
  );
};

export default App;
