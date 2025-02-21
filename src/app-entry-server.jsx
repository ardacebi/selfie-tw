import { renderToString } from "react-dom/server";
import App from "./client/App";

export function render() {
  return renderToString(<App />);
}
