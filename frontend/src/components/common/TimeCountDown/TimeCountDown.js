import React, { Component } from 'react';
import Script from 'react-load-script';
import './TimeCountDown.scss';

class TimeCountDown extends Component {

    init = () => {

        const { milliseconds } = this.props;

        var clock = window.$('.your-clock').FlipClock(milliseconds/1000, {
            // clockFace: 'DailyCounter',
            // clockFace: 'HourlyCounter',
            countdown: true
        });
    }    

    render() {

        const { init } = this;
        
        return(
            <div>
                <div className="your-clock"></div>
                <Script 
                    url="/flipclock/flipclock.min.js"
                    onLoad={() => init()}
                />
            </div>
        );
    }
}

export default TimeCountDown;