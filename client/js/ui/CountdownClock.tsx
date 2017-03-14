import * as React from 'react';

interface CountdownClockInterface {
    initialTimeRemaining: number,
    interval: number,
    formatFunc?: Function,
    tickCallback: Function,
    completeCallback: Function
}

export default class CountdownClock extends React.Component<CountdownClockInterface, any> {
    _mounted : boolean;

    constructor(props, context) {
        super(props, context);

        this._mounted = false;

        this.state = {
            timeRemaining :this.props.initialTimeRemaining,
            timeoutId : null,
            prevTime :null,
        };
    }

    componentDidMount() {
        this._mounted = true;
        this.tick();
    };

    componentWillReceiveProps(newProps) {
        if (this.state.timeoutId) { clearTimeout(this.state.timeoutId); }
        this.setState({prevTime: null, timeRemaining: newProps.initialTimeRemaining});
    };

    componentDidUpdate() {
        if ((!this.state.prevTime) && this.state.timeRemaining > 0 && this._mounted) {
            this.tick();
        }
    };

    componentWillUnmount() {
        clearTimeout(this.state.timeoutId);
    };

    tick() {
        console.log(this.state);
        let currentTime = Date.now();
        let dt = this.state.prevTime ? (currentTime - this.state.prevTime) : 0;
        let interval = this.props.interval;

        // correct for small variations in actual timeout time
        let timeRemainingInInterval = (interval - (dt % interval));
        let timeout = timeRemainingInInterval;

        if (timeRemainingInInterval < (interval / 2.0)) {
            timeout += interval;
        }

        let timeRemaining = Math.max(this.state.timeRemaining - dt, 0);
        let countdownComplete = (this.state.prevTime && timeRemaining <= 0);

        if (this._mounted) {
            if (this.state.timeoutId) { clearTimeout(this.state.timeoutId); }
            this.setState({
                timeoutId: countdownComplete ? null : setTimeout(this.tick, timeout),
                prevTime: currentTime,
                timeRemaining: timeRemaining
            });
        }

        if (countdownComplete) {
            if (this.props.completeCallback) { this.props.completeCallback(); }
            return;
        }

        if (this.props.tickCallback) {
            this.props.tickCallback(timeRemaining);
        }
        console.log(this.state);
    };

    getFormattedTime(milliseconds) {
        if (this.props.formatFunc) {
            return this.props.formatFunc(milliseconds);
        }

        let totalSeconds = Math.round(milliseconds / 1000);

        let s = parseInt((totalSeconds % 60).toString(), 10);
        let m = parseInt((totalSeconds / 60).toString(), 10) % 60;
        let h = parseInt((totalSeconds / 3600).toString(), 10);

        let seconds = s < 10 ? '0' + s : s;
        let minutes = m < 10 ? '0' + m : m;
        let hours = h < 10 ? '0' + h : h;

        return hours + ':' + minutes + ':' + seconds;
    };

    render() {
        let timeRemaining = this.state.timeRemaining;

        return (
            <div className="timer">
                {this.getFormattedTime(timeRemaining)}
            </div>
        );
    }
}