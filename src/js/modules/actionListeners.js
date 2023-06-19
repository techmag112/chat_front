const actionListeners = (state, ws) => {

    // Объявление переменных
    let contextMenuLink = document.querySelectorAll(".context-menu__link"); 
    let contextMenuActive = "context-menu--active";
    let contextMenuActive2 = "context-menu2--active";

    let divUser = document.querySelector(".sidebarleft_body");
    let divPost = document.querySelector(".chatcontent");
 
    let menu;
    let menuState = 0;
    let menuWidth;
    let menuHeight;
    let windowWidth;
    let windowHeight;
    let clickCoords;
    let clickCoordsX;
    let clickCoordsY;

    let btnSend = document.querySelector('.chatmessage_send');
    let inputSend = document.querySelector('.chatwindow_newMessageInput');

    let windowEditFlag = false, windowTransferFlag = false;
    let shadowOverlay;
    let windowEditTag = document.querySelector('.layerEdit');
    let windowListChatTag = document.querySelector('.layerListChat');

    let listener1, listener2;
    let listForward = windowListChatTag.querySelector(".chatlistForward");
    let search = document.querySelector("#search3");

   
    const chatContext = document.querySelector(".chatcontent"); 
    let configWindow = document.querySelector(".configChat");
    let leftPanel = configWindow.querySelector(".chatlist");
    let rightPanel = configWindow.querySelector(".chatcontacts");

    
    init();

    function init() {
        inputSend.focus();
        LeftListener();
        RightListener();
        filterChatGroupList();
        renderLeftPanel();
        addForwardtListener();
        addEditorListener();
        addWindowEditListener();
        postListener();
        userListener();
        clickListener();
        contextMenuOffLeftClick();
        contextMenuOffRightClick();
        keyEscListener();
        resizeListener();
        filterForwardList();
      }

   function filterChatGroupList() {
        let search = document.querySelector("#search2");
        search.addEventListener("input", e => {
            renderLeftPanel(filterUserName(e.target.value, state.listgroup));
        });
    }

    function calcGroupSize() {
        let headerCount = document.querySelector(".header_info");
        let chatList = state.listgroup.filter(e => {
            return (e["group_status"] == 1);
        });
        let text = ''; //state.username + '&#013;';
        chatList.forEach(e => {text += e['username'] + '&#013;'});
        headerCount.innerHTML = '';
        headerCount.innerHTML =`<span title="${text}">Участники: ${chatList.length}</span>`;
    }

    function renderLeftPanel(array = state.listgroup) {
          removeLeftPanel();
          let rightarray = [];
          let leftarray = [];             
          leftarray = array.filter(e => {
                return (e["group_status"] == 0);
          });
          rightarray = state.listgroup.filter(e => {
               return (e["group_status"] == 1);
          });
          if ( state.currentchatid > 10000) {
            calcGroupSize();
          }

          leftarray.forEach((user) => {
            leftPanel.innerHTML += `
                        <div class="sidebarleft_contact_chat" data-id="${user['id']}">
                            <div class="sidebarleft_avatar">
                                <span class="avatar">
                                    <img class="avatar-photo" src="${state.urlImg}${user['avatar']}">
                                </span>
                                </div>
                                <div class="sidebarleft_title">
                                <div class="sidebarleft_owner">
                                    <span>${user['username']} </span>
                                </div>
                            </div>
                        </div>
                        `;
        });
        renderRightPanel(rightarray);   
    }

    function setState(id, status) {
            state.listgroup.forEach(e => {
                if(e["id"] == id) {
                    e["group_status"] = status;
                    if (e['id'] == state.userID) {
                      state.groupStatusMyUser = status;
                    }
                    stateGroupChatInDB(id, status);
                    // Синхронизация таблицы 
                    let post = {
                      command: "updatelist", 
                      message: state.listgroup,
                      channel: "10001"
                    };
                    ws.send(JSON.stringify(post));
                }
            });
    }
      
    function renderRightPanel(array) {
        removeRightPanel();
        array.forEach((user) => {
            rightPanel.innerHTML += `
                        <div class="sidebarleft_contact_chat" data-id="${user['id']}">
                            <div class="sidebarleft_avatar">
                                <span class="avatar">
                                    <img class="avatar-photo" src="${state.urlImg}${user['avatar']}">
                                </span>
                                </div>
                                <div class="sidebarleft_title">
                                    <div class="sidebarleft_owner">
                                        <span>${user['username']} </span>
                                    </div>
                                </div>
                            </div>
                        `;
        });
    }
  
    function removeLeftPanel() {
        leftPanel.innerHTML = ``;
    }

    function removeRightPanel() {
        rightPanel.innerHTML = ``;
    }

    function LeftListener() {
        leftPanel.addEventListener( "click", function(e) {
          let ItemIdContext  =  getIdOnClick(e); 
          let search = document.querySelector("#search2");
          search.value = '';
          setState(ItemIdContext, 1);
          renderLeftPanel();  
        });      
    }

    function RightListener() {
        rightPanel.addEventListener( "click", function(e) {
          let ItemIdContext  =  getIdOnClick(e);
          setState(ItemIdContext, 0);
          renderLeftPanel();  
        });     
    }
  
    function getIdOnClick(e) { 
        let node = e.target;
        let id;
        do {
            hasAttr(node, "data-id") ? id = node.getAttribute("data-id") : node = node.parentNode;
        } while (!id);
        return id;
    }
    
    function hasAttr(element, attr) {
        if(typeof element === 'object' && element !== null && 'getAttribute' in element  && element.hasAttribute(attr)) {
          return true;
        } else {
          return false;
        }
    }

    function keyEscListener() {
        window.onkeyup = function(e) {
          if ( e.keyCode === 27 ) { // Esc
            toggleMenuOff();
          }
        };
    }
  
    function contextMenuOffLeftClick() {
      document.addEventListener("click", function() {
        if ( menuState !== 0 ) {
          toggleMenuOff();
        }
      });
    }
  
    function contextMenuOffRightClick() {
      document.addEventListener("contextmenu", function() {
        if ( menuState !== 0 ) {
          toggleMenuOff();
        }
      });
    }
  
    function userListener() {
        divUser.addEventListener( "contextmenu", function(e) {
          if (!e.target.classList.contains('sidebarleft_body')) {
            state.currentid  =  getIdOnClick(e);
            toggleMenuOff();
            e.preventDefault();
            menu = document.querySelector(".context-menu2");
            toggleMenuOn2();
            positionMenu(e);
            e.stopPropagation();
          }
        });
      
    }
  
    function postListener() {
      divPost.addEventListener("contextmenu", function (e) {
        if ((e.target.classList.contains('chatcontent_mymessage_text') || e.target.classList.contains('chatcontent_body--my')) && getIdOnClick(e) != 0) {
          state.currentid = getIdOnClick(e);
          toggleMenuOff();
          e.preventDefault();
          menu = document.querySelector(".context-menu");
          toggleMenuOn();
          positionMenu(e);
          e.stopPropagation();
        }
      });
    }
  
    function toggleMenuOn() {
        if ( menuState !== 1 ) {
          menuState = 1;
          menu.classList.add(contextMenuActive);
        }
    }
  
    function toggleMenuOn2() {
      if ( menuState !== 1 ) {
        menuState = 1;
        menu.classList.add(contextMenuActive2);
      }
    }
    
    function toggleMenuOff() {  // Закрытие всех всплывающих окон
        if ( menuState !== 0 ) {
          menuState = 0;
          menu.classList.remove(contextMenuActive);
          menu.classList.remove(contextMenuActive2);
        }
    }
  
    function getPosition(e) {
      var posx = 0;
      var posy = 0;
     
      if (!e) {
        let e = window.event;
      }
     
      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + 
                           document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + 
                           document.documentElement.scrollTop;
      }
     
      return {
        x: posx,
        y: posy
      };
    }
  
    function positionMenu(e) {
      clickCoords = getPosition(e);
      clickCoordsX = clickCoords.x;
      clickCoordsY = clickCoords.y;
     
      menuWidth = menu.offsetWidth + 4;
      menuHeight = menu.offsetHeight + 4;
     
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
     
      if ( (windowWidth - clickCoordsX) < menuWidth ) {
        menu.style.left = windowWidth - menuWidth + "px";
      } else {
        menu.style.left = clickCoordsX + "px";
      }
     
      if ( (windowHeight - clickCoordsY) < menuHeight ) {
        menu.style.top = windowHeight - menuHeight + "px";
      } else {
        menu.style.top = clickCoordsY + "px";
      }
    }
  
    function resizeListener() {
      window.onresize = function(e) {
        toggleMenuOff();
      };
    }
  
    function clickListener() {
      contextMenuLink.forEach(function (element) {
        element.addEventListener( "click", function(e) {
          e.preventDefault();
          actionByRightClick(e.target);
        });
      });
    }
  
    function actionByRightClick( link ) {  
      toggleMenuOff();    
      if ((link.getAttribute("data-action") != "switch") && (state.groupStatusMyUser == 0) && (state.currentchatid == '10001')) {
        errorValue(".chatcontent");
      } else {
        switch (link.getAttribute("data-action")) {
          case "switch": 
            toggleAlarm(state.currentid);
            break;
          case "delete": 
            deleteMessage(state.currentid); 
            break;
          case "edit": 
            editMessage(state.currentid);
            break;
          case "forward": 
            forwardMessage(state.currentid);
            break;
        }
      }
    }
  
    function toggleAlarm(id) {
      const listContact = document.querySelector(".sidebarleft_body"); 
      let chatContact = listContact.querySelectorAll(".sidebarleft_contact_chat");
      chatContact.forEach((item) => {
          if (item.getAttribute("data-id") === id) {
            let alarmTag = item.querySelector("#alarm");
              if (alarmTag.className === "fa fa-bell-o") {
                  alarmTag.classList.remove("fa-bell-o");
                  alarmTag.classList.add("fa-bell-slash-o");
                  setFieldAlarm(id);
              } else {
                  alarmTag.classList.remove("fa-bell-slash-o");
                  alarmTag.classList.add("fa-bell-o");
                  setFieldAlarm(id);
              }      
          }
      });
    }
  
    function deleteMessage(id) {
      state.currentchat.forEach(e => {
        if ((e['id'] == id) && (e['chat_id'] == state.currentchatid)) {
          e['message'] = setMessage(id, "Данное сообщение удалено");
          let index = state.currentchat.findIndex(e => e.id == state.currentid);
          state.currentchat[index]["message"] = "Данное сообщение удалено";
        }
      });
          // Сообщить серверу и другому пользователю
          let post = {
            command: "edit", 
            to: getReceiverUserId(), 
            from: state.userID, 
            message: "Данное сообщение удалено",
            messageID: id
          };
          ws.send(JSON.stringify(post));
          modifyMessageInDB(id, state.currentchatid, "Данное сообщение удалено");
    }
  
    function editMessage(id) { 
      state.currentchat.forEach(e => {
        if ((e['id'] == id) && (e['chat_id'] == state.currentchatid)) {
          overlayDiv();
          windowEditFlag = true;
          windowEditTag.classList.add('active');
          windowEditTag.querySelector('.chatwindow_newMessageInput').value = e['message'];
        }
      });
    }
  
    function addWindowEditListener() { 
      windowEditTag.querySelector('.chatmessage_send').addEventListener('click', e => {
            closeOverlay();
            let index = state.currentchat.findIndex(e => e.id == state.currentid);
            state.currentchat[index]["message"] = windowEditTag.querySelector('.chatwindow_newMessageInput').value;
            setMessage(state.currentid, windowEditTag.querySelector('.chatwindow_newMessageInput').value, '(ред) ');
            e.stopPropagation();
      });
      windowEditTag.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            closeOverlay();
            let index = state.currentchat.findIndex(e => e.id == state.currentid);
            state.currentchat[index]["message"] = windowEditTag.querySelector('.chatwindow_newMessageInput').value;
            setMessage(state.currentid, windowEditTag.querySelector('.chatwindow_newMessageInput').value, '(ред) ');
            e.stopPropagation();
          }
       });
    }
  
    function setMessage(id, newmessage, status = '') {
      const selector = "[data-id=" + '"' + id + '"]';
      divPost.querySelector(selector).innerHTML = `
          <div class="chatcontent_body chatcontent_body--my" data-id=${id}>
              <span class="chatcontent_mymessage_text">${state.username}: ${status}${newmessage}</span>
              <span class="chatcontent_mymessage_time">${getTimePost()}</span>
          </div>`;
       // Отправить другой стороне и в базу
      let post = {
        command: "edit", 
        to: getReceiverUserId(), 
        from: state.userID, 
        message: status + newmessage,
        messageID: id
      };
      ws.send(JSON.stringify(post));
      modifyMessageInDB(id, state.currentchatid, status + newmessage);
    }
  
    function getTimePost() {
      const subbed = new Date();
      const hour = subbed.getHours().toString().length < 2 ? '0' + subbed.getHours() : subbed.getHours();
      const min = subbed.getMinutes().toString().length < 2 ? '0' + subbed.getMinutes() : subbed.getMinutes();
      return `${hour}:${min}`;
    }
  
    function addMyMessageInChat(message, chatID = state.currentchatid) { 
      const newIndex = getNewIndexCurrentChat(state.currentchat, chatID);
      const newMessage = `
              <div class="chatcontent_mymessage_wrapper chatcontent_mymessage">
                  <div class="chatcontent_body chatcontent_body--my" data-id=${newIndex}>
                      <span class="chatcontent_mymessage_text">${state.username}: ${message}</span>
                      <span class="chatcontent_mymessage_time">${getTimePost()}</span>
                  </div>
              </div>
      `;
      chatContext.insertAdjacentHTML("beforeend", newMessage);
      state.currentchat[state.currentchat.length] = {"id": newIndex, "chat_id": Number(chatID), "sender_id": state.userID, "message": message, "time_message": getTimePost(), "id1": state.userID, "id2": getReceiverUserId()};
      addMessageInDB(newIndex, Number(chatID), state.userID, message, getTimePost());
    }

    function getNewIndexCurrentChat(currentchat, chatId) { 
      const array = currentchat.filter(item => item['chat_id'] == chatId);
      return ++array.length;
    }
  
    function addEditorListener() {
        listener1 = function(){
          if (inputSend.value !== '') {
            if ((state.groupStatusMyUser == 0) && (state.currentchatid == '10001')) {
              errorValue();
            } else {
              let cleanMessage = DOMPurify.sanitize(inputSend.value); //, { USE_PROFILES: { html: true } });
              if (cleanMessage == '') { cleanMessage = 'Удалено защитой от XSS'; }
              addMyMessageInChat(cleanMessage);
              // Отправить другой стороне и в базу
              let username = state.username;
              if (state.currentchatid == '10001') {
                let post = {
                  command: "groupchat", 
                  message: username + ": " + cleanMessage,
                  channel: "10001"
                };
                ws.send(JSON.stringify(post));
              } else {
                let post = {
                  command: "message", 
                  to: getReceiverUserId(), 
                  from: state.userID, 
                  message: username + ": " + cleanMessage
                };
                ws.send(JSON.stringify(post));
              }
              // --------------------------------
            }
              inputSend.value = '';
              inputSend.focus();
          }
      };
        btnSend.addEventListener('click', listener1);
  
      listener2 = e => {
        if ((inputSend.value !== '') && (e.key === 'Enter')) {
          if ((state.groupStatusMyUser == 0) && (state.currentchatid == '10001')) {
            errorValue();
          } else {
              e.preventDefault();
              let cleanMessage = DOMPurify.sanitize(inputSend.value); //, { USE_PROFILES: { html: true } });
              if (cleanMessage == '') { cleanMessage = 'Удалено защитой от XSS'; }
              addMyMessageInChat(cleanMessage);
              // Отправить другой стороне и в базу
              let username = state.username;
              if (state.currentchatid == '10001') {
                let post = {
                  command: "groupchat", 
                  message: username + ": " + cleanMessage,
                  channel: "10001"
                };
                ws.send(JSON.stringify(post));
              } else {
                let post = {
                  command: "message", 
                  to: getReceiverUserId(), 
                  from: state.userID, 
                  message: username + ": " + cleanMessage
                };
                ws.send(JSON.stringify(post));
              }
              // --------------------------------
            }            
            inputSend.value = '';
            inputSend.focus();
          }
        };
        window.addEventListener('keydown', listener2);
    }  
  
    function removeEditorListener() {
      btnSend.removeEventListener('click', listener1, false);
      window.addEventListener('keydown', listener2, false);
    }
  
  
    function overlayDiv() { 
      if ((!windowEditFlag) && (!windowTransferFlag)) {
          shadowOverlay = document.createElement('div');
          shadowOverlay.classList.add('overlay__shadow');
          document.body.appendChild(shadowOverlay);
          shadowOverlay.classList.add('overlay__shadow--show');
          removeEditorListener();
          shadowOverlay.addEventListener('click', e => {
            if (e.target.classList.contains('overlay__shadow')) {
                closeOverlay();
            }
          });
          window.addEventListener('keydown', e => {
            if ((e.key === 'Escape') & ((windowEditFlag) || (windowTransferFlag))) {
                closeOverlay();
            }
          });
      } else {
          shadowOverlay.classList.remove('overlay__shadow--show');
          shadowOverlay.classList.remove('overlay__shadow');
          document.body.removeChild(shadowOverlay);
          addEditorListener();
      }
    }
    
    function closeOverlay() {
      if ((windowEditFlag) || (windowTransferFlag)) {
          shadowOverlay.classList.remove('overlay__shadow--show');
          shadowOverlay.classList.remove('overlay__shadow');
          document.body.removeChild(shadowOverlay);
          windowEditTag.classList.remove('active');
          windowListChatTag.classList.remove('active');
          windowEditFlag = false;
          windowTransferFlag = false;
          addEditorListener();
      }
    }
  
    function forwardMessage(messageid) {
        overlayDiv();
        state.currentid = messageid;
        windowTransferFlag = true;
        windowListChatTag.classList.add('active');
        renderforwardWindow();
    }
  
    function renderforwardWindow(array = state.arr) {
          let chatList = [];
          chatList = array.filter(e => {
                return (state.groupStatusMyUser != 0) ? e['chat_id'] < 10002 : e['chat_id'] < 10001;
            });
          listForward.innerHTML = '';
          chatList.forEach((user) => {
            if (user['chat_id'] != state.currentchatid) {
                  listForward.innerHTML += `
                        <div class="sidebarleft_contact_chat" data-id="${user['chat_id']}">
                            <div class="sidebarleft_avatar">
                                <span class="avatar">
                                    <img class="avatar-photo" src="${state.urlImg}${user['avatar']}">
                                </span>
                                </div>
                                <div class="sidebarleft_title">
                                <div class="sidebarleft_owner">
                                    <span>${user['username']} </span>
                                </div>
                            </div>
                        </div>
                  `;
            }
        });
    }
  
    function addForwardtListener() {
      listForward.addEventListener("click", function(e) {
          e.stopPropagation();
          let forwardChatId  =  getIdOnClick(e); 
          let message = '';	
          state.currentchat.forEach(e => {
            if(e['id'] == state.currentid) {
               message = "Forward->" + e['message'];
            }
          });
          const newIndex = getNewIndexCurrentChat(state.currentchat, forwardChatId);
          state.currentchat[state.currentchat.length] = {"id": newIndex, "chat_id": Number(forwardChatId), "sender_id": state.userID, "message": message, "time_message": getTimePost(), "id1": state.userID, "id2": getReceiverUserId(Number(forwardChatId))};
          addMessageInDB(newIndex, Number(forwardChatId), state.userID, message, getTimePost());	
          // Отправить другой стороне и в базу
          if (getReceiverUserId(Number(forwardChatId)) < 10000) {
             let post = {
                  command: "message", 
                  to: getReceiverUserId(Number(forwardChatId)),
                  from: state.userID, 
                  message: message
                 };
                 ws.send(JSON.stringify(post));
              } else {
                  let post = {
                    command: "groupchat",
                    message: message,
                    channel: "10001"
                  };
                  ws.send(JSON.stringify(post))
              }
              // ------------------------------
               closeOverlay();    
        });
      }
  
    function filterForwardList() {
      search.addEventListener("input", e => {
        renderforwardWindow(filterUserName(e.target.value, state.arr));
      });
    }
  
    function filterUserName(value, array) {
      return array.filter(it => it['username'].toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    function addReceiverMessageInChat(message, receiverUserId) {
      const newIndex = getNewIndexCurrentChat(state.currentchat, getReceiverChatIdfromUserId(receiverUserId));
      if (getReceiverChatIdfromUserId(receiverUserId) == state.currentchatid) {
          const newMessage = `
                            <div class="chatcontent_mymessage_wrapper chatcontent_yourmessage" data-id=${newIndex}>
                                <div class="chatcontent_body">
                                    <span class="chatcontent_yourmessage_text">${message}</span>
                                    <span class="chatcontent_yourmessage_time">${getTimePost()}</span>
                                </div>
                            </div>
                        `;
          chatContext.insertAdjacentHTML("beforeend", newMessage);
      }
      alarmCheck(getReceiverChatIdfromUserId(receiverUserId), receiverUserId);
      state.currentchat[state.currentchat.length] = {
        "id": newIndex,
        "chat_id": getReceiverChatIdfromUserId(receiverUserId),
        "sender_id": receiverUserId,
        "message": message,
        "time_message": getTimePost(),
        "id1": receiverUserId,
        "id2": state.userID
      };
    }

    function addReceiverMessageInGroupChat(message) {
      const newIndex = getNewIndexCurrentChat(state.currentchat, 10001);
      if ((state.currentchatid == 10001) && (state.groupStatusMyUser == 1))  {
          const newMessage = `
                            <div class="chatcontent_mymessage_wrapper chatcontent_yourmessage" data-id=${newIndex}>
                                <div class="chatcontent_body">
                                    <span class="chatcontent_yourmessage_text">${message}</span>
                                    <span class="chatcontent_yourmessage_time">${getTimePost()}</span>
                                </div>
                            </div>
                        `;
          chatContext.insertAdjacentHTML("beforeend", newMessage);
      }
      if (state.groupStatusMyUser == 1) {
        alarmCheck(10001, 10001);
      }
      state.currentchat[state.currentchat.length] = {
        "id": newIndex,
        "chat_id": 10001,
        "sender_id": 10001,
        "message": message,
        "time_message": getTimePost(),
        "id1": 10001,
        "id2": 10001
      };
    }

    function modifyReceiverMessageInChat(id, receiverUserId, message) {
      if (getReceiverChatIdfromUserId(receiverUserId) == state.currentchatid) {
        const selector = "[data-id=" + '"' + id + '"]';
        divPost.querySelector(selector).innerHTML = `
              <div class="chatcontent_mymessage_wrapper chatcontent_yourmessage" data-id=${id}>
                <div class="chatcontent_body">
                  <span class="chatcontent_yourmessage_text">${message}</span>
                  <span class="chatcontent_yourmessage_time">${getTimePost()}</span>
                </div>
              </div>
            `;
      }
      let index = state.currentchat.findIndex(e => e.id == id);
      alarmCheck(getReceiverChatIdfromUserId(receiverUserId), receiverUserId);
      state.currentchat[index] = {
        "id": id,
        "chat_id": getReceiverChatIdfromUserId(receiverUserId),
        "sender_id": receiverUserId,
        "message": message,
        "time_message": getTimePost(),
        "id1": receiverUserId,
        "id2": state.userID
      };
    }

    function getReceiverChatIdfromUserId(receiverUserId) { 
      const array = state.arr.filter(item => {
        return (((item['id1'] == receiverUserId) && (item['id2'] == state.userID)) || ((item['id1'] == state.userID) && (item['id2'] == receiverUserId)));
      });
        return array[0]['chat_id'];
    }

    function getReceiverChatIdfromMessageId(messageId) { 
      const array = state.currentchat.filter(item => item["id"] == messageId);
        return array[0]['chat_id'];
    }

    function getReceiverUserId(chatId = state.currentchatid) { 
      const array = state.arr.filter(item => item['chat_id'] == chatId);
         if (array[0]['id1'] == state.userID) {
            return array[0]['id2'];
          } else {
            return array[0]['id1'];
          }
    }

    function alarmCheck(chatId, userId) {
      let index = state.arr.findIndex(e => e.chat_id == chatId);
         if ((state.arr[index]['id1'] == userId))  {
            if (state.arr[index]['alarm1'] == 1) {
              alarmPlay();
            }
          } else {
            if (state.arr[index]['alarm2'] == 1) {
              alarmPlay();
            }
          }
    }

    function alarmPlay() {
      var audio = new Audio();
      audio.preload = 'auto';
      audio.src = '../public/wav/alarm.mp3';
      audio.play();
    }

    function setFieldAlarm(chatId) { 
      let index = state.arr.findIndex(e => e.chat_id == chatId);
         if ((state.arr[index]['id1'] == state.userID)) {
            state.arr[index]['alarm2'] ? state.arr[index]['alarm2'] = 0 : state.arr[index]['alarm2'] = 1;
          } else {
            state.arr[index]['alarm1'] ? state.arr[index]['alarm1'] = 0 : state.arr[index]['alarm1'] = 1;
          }
          updateAlarm(chatId, state.arr[index]['alarm1'], state.arr[index]['alarm2']);
    }

    function stateGroupChatInDB(id, status) {
      axios({
        method: 'post',
        url: '/putlistgroup/index.php',
        headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
        data:  {"id": id, "status": status}
        })
        .then(() => {
            console.log('Статусы групп чата успешно загружены!');
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    function addMessageInDB(id, chatid, send_id, message, time) {
      axios({
        method: 'post',
        url: '/putmessage/index.php', 
        headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
        data:  {"id": id, "chatid": chatid, "send_id": send_id, "message": message, "time": time}
        })
        .then(() => {
            console.log('Чат-сообщение ' + message + ' успешно загружено!');
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    function modifyMessageInDB(id, chatid, message, time) {
      axios({
        method: 'post',
        url: '/updatemessage/index.php',
        headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
        data:  {"id": id, "chatid": chatid, "message": message, "time": time}
        })
        .then(() => {
          console.log('Чат-сообщение ' + message + ' успешно загружено!');
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    function updateAlarm(chatid, alarm1, alarm2) {
      axios({
        method: 'post',
        url: '/updatealarm/index.php',
        headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
        data:  {"chatid": chatid, "alarm1": alarm1, "alarm2": alarm2}
        })
        .then(() => {
          console.log('Аларм успешно обновлен!');
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    function synchroGroupStatus(array) {
      array.forEach((item, index) => {
        state.listgroup[index]['group_status'] = item['group_status'];
        if ((state.listgroup[index]['id'] == state.userID) && (state.groupStatusMyUser == 0) && (state.listgroup[index]['group_status'] == 1) ) {
          state.groupStatusMyUser = 1;
          reRenderGroupChat();
        }
      });
      renderLeftPanel();
    }

    function reRenderGroupChat() {
      
    }

    function errorValue(selector='.chatwindow_area') {
      const errorDiv = document.querySelector(selector);
      errorDiv.style.border = '1px solid red';
      setTimeout(() => {
          // Удаляем слой через 1000 мс
          errorDiv.style.border = 'none';
      }, 1000);  
    }

    // Обработка входящих сообщений
    ws.onmessage = (e)=> {
          console.log(e.data);
          let info = JSON.parse(e.data);
          console.log(info);
          switch (info.command) {
            case 'message':
                addReceiverMessageInChat(info.message, info.from);
                break;
            case 'groupchat':
                addReceiverMessageInGroupChat(info.message);
                break;
            case 'updatelist':
                synchroGroupStatus(info.message);
                //state.test = info.message;
                //console.log('state.test ', state.test);
                break;
            case 'edit':
                modifyReceiverMessageInChat(Number(info.messageID), info.from, info.message);
                break;
            default:
              //console.log(info);
          }
    };

};

export default actionListeners;