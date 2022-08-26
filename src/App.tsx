import { Route, Routes } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import Form from "./pages/Form";
const Result = lazy(() => import("./pages/Result"));

const App: Component = () => {
  return (
    <div class="p-8">
      <Routes>
        <Route path="/" component={Form} />
        <Route path="/result" component={Result} />
      </Routes>
    </div>
  );
};

export default App;
