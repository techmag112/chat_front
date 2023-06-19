import getState from "./modules/getState";
import hamburger from "./modules/hamburger";
import actionListeners from "./modules/actionListeners";
import renderChatComponets from "./modules/renderChatComponets";
import DOMPurify from 'isomorphic-dompurify';

let state = {
    userID: "", // current user ID
    username: "", // current username 
    avatar: "",
    groupStatusMyUser: 0,
    arr: [], // array chat list
    currentchat: [], // array messeges current chat
    listgroup: [],
    currentchatid: 0, // current chat id
    currentid: 0, // current id message
    urlImg: "../public/uploads/avatar/"  //"../public/uploads/avatar/"  "../assets/img/avatar/"
};
state.arr[0] = {"id": 1, "chat_id" :10001, "id1": 10001, "alarm1": 0, "id2": 10001, "alarm2": 0, "lasttime":"", "email": "нет", "username":"Group Chat", "avatar": "avatar-m.png", "email_status": 1, "group_status": 0};
getState(state);  

window.addEventListener('DOMContentLoaded', () => {
    
    const ws = new WebSocket("ws://localhost:8090");

    ws.onopen = (e) => {   // Открываем канал с сервером чата
        console.log("Connection established! " + e);
    };

    //  conn.send(JSON.stringify({command: "subscribe", channel: "global"}));
    //  conn.send(JSON.stringify({command: "groupchat", message: "hello glob", channel: "global"}));
    // command: "groupchat", message: "hello glob", channel: "global"
    //  conn.send(JSON.stringify({command: "message", to: "1", from: "9", message: "it needs xss protection"}));
    // conn.send(JSON.stringify({command: "register", userId: 9}));

    setTimeout(function() {
        hamburger();
        renderChatComponets(state);
        actionListeners(state, ws);
        ws.send(JSON.stringify({command: "register", userId: state.userID})); // Регистрируем пользователя в чате
        ws.send(JSON.stringify({command: "subscribe", channel: "10001"}));
    }, 1000);


});