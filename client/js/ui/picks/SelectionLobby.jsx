"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var SelectionLobby = (function (_super) {
    __extends(SelectionLobby, _super);
    function SelectionLobby(props, context) {
        return _super.call(this, props, context) || this;
    }
    SelectionLobby.prototype.render = function () {
        return (<div className="app">
                <div id="player1" className="picks panel">
                    <h2>Your picks</h2>
                    <ul>
                        <li>
                            <img src="http://lorempixel.com/200/100/people/3"/>
                            <span>Rocketeer</span>
                        </li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                    </ul>
                </div>

                <div id="main" className="panel">
                    <h2 className="shimmer">{"It's your turn to pick"}</h2>
                    <div id="heroes">
                        <ul>
                            <li>
                                <img src="http://lorempixel.com/200/100/people/7"/>
                                <span>Rifleman</span>
                            </li>
                            <li>
                                <img src="http://lorempixel.com/200/100/people/9"/>
                                <span>Tank Buster</span>
                            </li>
                            <li className="inactive">
                                <img src="http://lorempixel.com/200/100/people/3"/>
                                <span>Rocketeer</span>
                            </li>
                            <li>
                                <img src="http://lorempixel.com/200/100/people/8"/>
                                <span>Rick Picker</span>
                            </li>
                            <li>
                                <img src="http://lorempixel.com/200/100/people/2"/>
                                <span>Medic</span>
                            </li>
                            <li>
                                <img src="http://lorempixel.com/200/100/people/5"/>
                                <span>Mechanic</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div id="player2" className="picks panel">
                    <h2>{"Player2's picks"}</h2>
                    <ul>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                    </ul>
                </div>
            </div>);
    };
    return SelectionLobby;
}(React.Component));
exports.default = SelectionLobby;
