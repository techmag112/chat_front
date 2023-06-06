import hamburger from "./modules/hamburger";
//import clickmenu from "./modules/clickmenu";
//import chatList from "./modules/chatlist";
import actionListeners from "./modules/actionListeners";
import renderChatComponets from "./modules/renderChatComponets";



window.addEventListener('DOMContentLoaded', () => {

  let chatListJSON = `[
    {"id": 0, "chat_id": 1, "contact_id": 1, "username": "Ivan", "avatar": "avatar-b.png", "status": "on", "email": "a@a.com", "lasttime": "12:50", "alert": "on", "group": false},
    {"id": 0, "chat_id": 2, "contact_id": 2, "username": "Masha", "avatar": "avatar-c.png", "status": "on", "email": "Скрыто", "lasttime": "12:56", "alert": "off", "group": false},
    {"id": 0, "chat_id": 3, "contact_id": 3, "username": "Lena", "avatar": "avatar-d.png", "status": "away", "email": "Скрыто", "lasttime": "12:40", "alert": "on", "group": false},
    {"id": 0, "chat_id": 4, "contact_id": 4, "username": "Sveta", "avatar": "avatar-e.png", "status": "off", "email": "c@c.com", "lasttime": "12:34", "alert": "on", "group": false},
    {"id": 0, "chat_id": 5, "contact_id": 5, "username": "Piter", "avatar": "avatar-f.png", "status": "on", "email": "e@e.com", "lasttime": "12:27", "alert": "on", "group": false},
    {"id": 0, "chat_id": 6, "contact_id": 6, "username": "Kesha", "avatar": "avatar-g.png", "status": "on", "email": "Скрыто", "lasttime": "12:25", "alert": "on", "group": false},
    {"id": 0, "chat_id": 7, "contact_id": 7, "username": "Marina", "avatar": "avatar-h.png", "status": "on", "email": "Скрыто", "lasttime": "12:22", "alert": "off", "group": false},
    {"id": 0, "chat_id": 8, "contact_id": 8, "username": "Kirill", "avatar": "avatar-i.png", "status": "away", "email": "Скрыто", "lasttime": "12:17", "alert": "on", "group": false},
    {"id": 0, "chat_id": 9, "contact_id": 9, "username": "Mira", "avatar": "avatar-j.png", "status": "on", "email": "f@f.com", "lasttime": "12:15", "alert": "on", "group": false},
    {"id": 0, "chat_id": 10, "contact_id": 10, "username": "Nikita", "avatar": "avatar-k.png", "status": "off", "email": "n@n.com", "lasttime": "12:05", "alert": "on", "group": false},
    {"id": 0, "chat_id": 1001, "contact_id": 1001, "username": "Group 1", "avatar": "avatar-m.png", "status": "on", "email": "Скрыто", "lasttime": "13:05", "alert": "on", "group": false}
  ]`;

  let messagesJSON = `[
    {"id": 1, "chat_id": 2, "send_id": 0, "message": "Привет пока!", "time": "12:50"},
    {"id": 2, "chat_id": 2, "send_id": 2, "message": "Маракуйя! Какуя маракуйя?", "time": "12:50"},
    {"id": 3, "chat_id": 2, "send_id": 2, "message": "Воу воу воу!", "time": "12:55"},
    {"id": 4, "chat_id": 2, "send_id": 2, "message": "Воу воу воу!!", "time": "12:57"},
    {"id": 5, "chat_id": 2, "send_id": 2, "message": "Воу воу воу!!!", "time": "12:59"},
    {"id": 6, "chat_id": 2, "send_id": 0, "message": "Круто :)", "time": "13:50"},
    {"id": 7, "chat_id": 1, "send_id": 0, "message": "Тук-тук!", "time": "13:51"},
    {"id": 8, "chat_id": 1, "send_id": 0, "message": "Есть кто там?", "time": "13:55"},
    {"id": 9, "chat_id": 1, "send_id": 1, "message": "Я :)", "time": "14:01"},
    {"id": 10, "chat_id": 1, "send_id": 0, "message": "Здорово!", "time": "14:05"},
    {"id": 11, "chat_id": 3, "send_id": 0, "message": "Ау!", "time": "14:15"},
    {"id": 12, "chat_id": 3, "send_id": 3, "message": "Ыыы!", "time": "14:25"}
  ]`;
  

    let state = {
      userID: 0, // current user ID
      username: "Max Pain", // current username
      arr: [], // array chat list
      currentchat: [], // array messeges current chat
      currentchatid: 0, // current chat id
      currentid: 0 // current id message
    };

    state.arr = JSON.parse(chatListJSON);
    state.currentchat = JSON.parse(messagesJSON);

    //clickmenu(state);
    //chatList(state);
    hamburger();
    renderChatComponets(state);
    actionListeners(state);


});