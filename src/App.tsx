import { Authenticator } from "@aws-amplify/ui-react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { TodoPage } from "./pages/TodoPage";

function App() {
  return (
    <Authenticator>
      <TodoPage />;
    </Authenticator>
  );
}

export default App;
