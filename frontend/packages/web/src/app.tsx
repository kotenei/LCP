import { ConfigProvider } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import { Home } from "./routes/home";
import { Detail } from "./routes/detail";
import { Editor } from "./routes/editor";
import store from "./store";

import "./assets/index.scss";

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Editor />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/editor/:id" element={<Editor />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
