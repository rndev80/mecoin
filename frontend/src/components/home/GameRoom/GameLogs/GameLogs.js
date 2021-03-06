import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import './GameLogs.scss';
import GameLogsItem from '../GameLogsItem';
import cx from 'classnames';

class GameLogs extends Component {

    render() {

        const { logs, total, showHeader, winner, winnerTicket, winnerTicketCount } = this.props;
        let i = 0;
        const logsView = logs && logs.map(log => {
            const gems = log[2]-log[1]+1;
            const percent = log[3] * 100 / total;
            const roundedPercent = Math.round(percent * 100) / 100;
            const tickets = log[1] === log[2] ? log[1] : log[1]+"-"+log[2];
            return (
                <GameLogsItem key={i++} message={log[0] + " Deposited "+gems+" Gems giving him "+roundedPercent+"% to win. Owns #"+tickets}/>
            )
        });

        const winPercent = winnerTicketCount * 100 / total;
        const roundedWinPercent = Math.round(winPercent * 100) / 100;

        

        return(
            <div className="h-100 w-100 p-2 gameLogsContainer">

                {showHeader &&
                <div className="gameLogsHeader mb-1 ">

                    <p className="text-center p-2">
                        {winner} won the last game with number #{winnerTicket} and with a {roundedWinPercent}% chance winning {total} Jackpot!
                    </p>

                </div>
                }
                
                <div className={cx('gameLogsBody', {'h-100': !showHeader})}>
                    <Scrollbars className="gameLogsScrollbarContainer"
                        ref={(ref) => {
                            this.scrollBox = ref
                        }}
                    >
                        {logsView}

                    </Scrollbars>
                </div>

            </div>
        );
    }

}

export default GameLogs;