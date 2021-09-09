import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import CssList from "./Sections/CssList";
import Config from "./Page/Config";
import { createMemoryHistory } from "history";
import Nav from "./Sections/Nav";
const history = createMemoryHistory();

// const Data = [
//   {
//     base: {
//       name: "MOF1",
//       logo: "https://cdn.discordapp.com/attachments/881449105782620160/885188254578659338/toppng.com-design-for-logo-356x330.png", // URL
//       cover:
//         "https://images.unsplash.com/photo-1490810194309-344b3661ba39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=990&q=80", // URL
//       description: `Krunker CSS is created to give players a different kind of experience in terms of Ui. Ui is pretty much clean. CSS is completely open-source anyone can use codes as they want (At least give some credit). Menu Ui is very much inspired by CSGO. To use the CSS you have to paste all of the files into KrunkerResourceSwapper.`,
//       repo: "dasd", // URL
//       site: "sdasd", // URL
//       credits: [
//         {
//           name: "epicX67",
//           contacts: [
//             {
//               type: "Github",
//               link: "", // URL
//             },
//             {
//               type: "Youtube",
//               link: "", // URL
//             },
//           ],
//         },
//         {
//           name: "ThieF",
//           contacts: [
//             {
//               type: "Youtube",
//               link: "", // URL
//             },
//           ],
//         },
//       ],
//     },
//     main: {
//       target_type: "zip",
//       target_url:
//         "https://raw.githubusercontent.com/MOF1/krunker_css_raw/main/TheiF_CSS.zip", // URL
//       target_file: "css/configs.css",
//     },
//     configs: [
//       {
//         title: "Your Logo",
//         type: "imageURL",
//         var: "--main-logo",
//         default: "", // Can be null
//         description:
//           "This logo will show in krunker main page & other places like ingame ui health section as well.",
//         hint_image:
//           "https://images.unsplash.com/photo-1553481187-be93c21490a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", // URL
//       },
//       {
//         title: "Blur",
//         type: "select",
//         var: "--blur-radius",
//         default: "On", // Can be null
//         description: "",
//         hint_image: "", // URL
//         options: [
//           {
//             name: "On",
//             value: "20px",
//             raw_value: `--status-bar: 20px;
// --ads: 0px;`,
//           },
//           {
//             name: "Off",
//             value: "0px",
//           },
//         ],
//       },
//       {
//         title: "Accent Color",
//         type: "color",
//         var: "--accent-color",
//         default: "#FFFFFF", // Can be null
//         description: "",
//         hint_image: "", // URL
//       },
//     ],
//   },
// ];

function App() {
  return (
    <Router history={history}>
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
    </Router>
  );
}

export default App;
