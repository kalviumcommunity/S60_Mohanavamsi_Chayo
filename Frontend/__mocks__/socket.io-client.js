import SocketMock from 'socket.io-mock';

const socket = new SocketMock();

export default () => socket;