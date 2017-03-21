import * as React from 'react';
import {AvailableSelectionsInterface} from "./AvailableSelectionsInterface";
import {SelectionLobbyStatus} from "./SelectionLobbyStatus";
import CountdownClock from "../CountdownClock";

export default class AvailableSelections extends React.Component<AvailableSelectionsInterface, any> {
    constructor(props,context) {
        super(props,context);
    }

    render () {
        let heroList = this.heroListJSX();
        let title = this.titleJSX();

        return (
            <div>
                {title}
                <div id="heroes">
                    <ul>
                        {heroList}
                    </ul>
                </div>
            </div>
        );
    }

    heroListJSX() {
        let className = '';

        if(!this.props.isActive) {
            className = 'inactive';
        }

        return this.props.heroes.map((a, index) => {
            let avail;
            let handler = this.onSelect.bind(this, a);

            if(a.available == false) avail = 'inactive';

            return (
                <li onClick={handler}
                    key={index}
                    className={className + ' ' + avail}>
                    <img src={a.url}/>
                    <span>{a.name}</span>
                </li>
            );
        });

    }

    titleJSX() {
        let text;
        let className;

        if(!this.props.isActive) {
            text = "Your opponent is picking";
            className="";
        } else {
            text = "It's your turn to pick";
            className="shimmer";
        }

        return <h2 className={className}>{text}</h2>;
    }

    onSelect(selection, e) {
        e.preventDefault();

        if(selection.available == false)
            return ;

        this.props.onSelect(selection);
    }
}