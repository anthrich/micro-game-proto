import * as React from 'react';

export interface LoadingOverlayInterface {
    show : boolean;
    message : string;
}

export default class LoadingOverlay extends React.Component<LoadingOverlayInterface, any> {
    constructor(props,context) {
        super(props,context);
    }

    render () {
        if(!this.props.show)
            return null;

        return (
            <div className="status-overlay">
                <div className="loader">
                    <span>{"{"}</span>
                    {this.props.message}
                    <span>{"}"}</span>
                </div>
            </div>
        );
    }
}