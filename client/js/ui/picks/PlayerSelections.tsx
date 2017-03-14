import * as React from 'react';
import {PlayerSelectionsInterface} from "./PlayerSelectionsInterface";
import NullHeroPortrait from "../data/NullHeroPortrait";

export default class PlayerSelections extends React.Component<PlayerSelectionsInterface, any> {
    constructor(props,context) {
        super(props,context);

        this.state = {
            portraits : []
        };

        this.populatePortraits();
    }

    render () {
        let listItems = this.listItemsJSX();
        let title = this.titleJSX();

        return (
            <div id="player1" className="picks panel">
                <h2>{title}</h2>
                <ul>
                    {listItems}
                </ul>
            </div>
        );
    }

    getSelections() {
        return this.props.selections.getSelections();
    }

    getMaxSelections() {
        return this.props.selections.getMaxSelections();
    }

    populatePortraits() {
        let playerSelections = this.getSelections();

        for(let a = 0; a < this.getMaxSelections(); a++) {
            if(typeof(playerSelections[a]) != "undefined") {
                this.state.portraits.push(playerSelections[a]);
            } else {
                this.state.portraits.push(new NullHeroPortrait());
            }
        }
    }

    listItemsJSX() {
        return this.state.portraits.map((p, index) => {
            let jsx;

            if(p instanceof NullHeroPortrait) {
                jsx = index + 1;
            } else {
                jsx = (
                    <div>
                        <img src={p.url} />
                        <span>{p.name}</span>
                    </div>
                )
            }

            return <li key={index}> {jsx} </li>
        });
    }

    titleJSX() {
        if(this.props.current_user) {
            return 'Your picks';
        } else {
            return 'Their picks';
        }
    }
}