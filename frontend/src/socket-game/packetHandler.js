import * as helper from './helper';
import { log } from './helper';
import {client as SEND, server as RECEIVE} from './packetTypes';
import notify from 'helpers/notify';
import store from 'store';
import * as gameActions from 'store/modules/game';
import * as dashboardActions from 'store/modules/dashboard';
import storage from 'helpers/storage';

const updateGame = (payload) => {
  if(payload.game.winner) {
    const { userId } = storage.get('__USER__');
    
    store.dispatch(dashboardActions.getBalance(userId));
    store.dispatch(dashboardActions.getStatisticsInfo(userId));
    
  }
  store.dispatch(gameActions.updateGameData(payload));
}

const updateGameRoomInfo = (payload) => {
  store.dispatch(gameActions.updateGameRoomInfo(payload));
}

const updateRandomNumber = (payload) => {
  store.dispatch(gameActions.updateRandomNumber(payload));
}

const service = {
  success: {
    enter: (packet) => {
      log('RECEIVE ENTER_SUCCESS');
      notify({type: 'success', message: '[GAME] RECEIVE ENTER_SUCCESS'});
    },
    auth: (packet) => {
      log('RECEIVE AUTH_SUCCESS');
      notify({type: 'success', message: '[GAME] RECEIVE AUTH_SUCCESS'});
    }
  },

  error: (packet) => {
    switch (packet.payload.code) {
      default:
        log('RECEIVE ERROR');
        notify({type: 'success', message: '[GAME] RECEIVE ERROR'});
    }
  },

  gameData: (packet) => {
    log('RECEIVE UPDATED GAME DATA');
    notify({type: 'success', message: '[GAME] RECEIVE UPDATED GAME DATA'});
    if( packet && packet.payload )
    updateGame(packet.payload);
  },
  
  gameRoomInfo: (packet) => {
    log('RECEIVE UPDATED GAME ROOM INFORMATION');
    if( packet && packet.payload )
    updateGameRoomInfo(packet.payload);
  },

  randomNumber: (packet) => {
    log('RECEIVE RANDOM NUMBER FOR CHOOSING WINNER');
    if( packet && packet.payload )
    updateRandomNumber(packet.payload);
  }

}

export default function packetHandler(packet) {
  const o = helper.tryParseJSON(packet);

  if (!o) {
    return console.error('[GAME-SOCKET] Received invalid response from server');
  }

  switch (o.type) {
    case RECEIVE.SUCCESS.ENTER:
      service.success.enter(o);
      break;
    case RECEIVE.SUCCESS.AUTH:
      service.success.auth(o);
      break;
    case RECEIVE.ERROR:
      service.error(o);
      break;
    case RECEIVE.GAMEDATA:
      service.gameData(o);
      break;
    case RECEIVE.GAMEROOMINFO:
      service.gameRoomInfo(o);
      break;
    case RECEIVE.RANDOM_NUMBER: 
      service.randomNumber(o);
      break;
    default:
      break;
  }
}