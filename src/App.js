import "./App.css";
import { HashRouter, Switch, Route } from "react-router-dom";
import CssList from "./Sections/CssList";
import Config from "./Page/Config";
import Nav from "./Sections/Nav";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Nav />
        <Switch>
          <Route exact path="/:css_name">
            <Config />
          </Route>
          <Route exact path="/">
            <CssList />
          </Route>
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
