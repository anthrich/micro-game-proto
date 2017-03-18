import * as React from 'react';

interface CountdownClockInterface {
    initialTime: number,
    elapsedTime : number
}

export default class CountdownClock extends React.Component<CountdownClockInterface, any> {

    constructor(props, context) {
        super(props, context);

        this.state = {
            active : false,
            initialTime : this.props.initialTime,
            elapsedTime : this.props.elapsedTime,
            remainingTime : this.props.initialTime,
            secondsRemaining : 0
        };
    }

    componentWillReceiveProps(newProps) {
        let active = (newProps.initialTime ? true : false);

        if(!active) return;

        let elapsed = (newProps.elapsedTime > 0 ? newProps.elapsedTime : 0);
        let remaining = newProps.initialTime - elapsed;

        if(remaining <= 0) {
            active = false;
        }

        this.setState({
            active : active,
            initialTime : newProps.initialTime,
            elapsedTime : this.props.elapsedTime,
            remainingTime : remaining,
            secondsRemaining : Math.ceil((remaining / 1000))
        });
    }

    render() {
        if(!this.state.active)
            return null;

        let percentRemaining = (this.state.remainingTime / this.state.initialTime * 100)
            .toString();
        let classes = this.getClassName(parseInt(percentRemaining));

        return (
            <div className={classes}>
                <span>{this.state.secondsRemaining}s</span>
                <div className="slice">
                    <div className="bar"></div>
                    <div className="fill"></div>
                </div>
            </div>
        );
    }

    getClassName(percent) : string {
        return 'c100 dark p' + percent + ' small';
    }
}