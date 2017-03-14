"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
class App extends React.Component {
    render() {
        return <p> Hello React!</p>;
    }
}
const ele = <App users="test"/>;
ReactDOM.render(ele, document.getElementById('app'));
