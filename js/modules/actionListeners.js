const actionListeners = (state) => {

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
            renderLeftPanel(filterUserName(e.target.value, state.arr));
        });
    }

    function calcGroupSize() {
        let headerCount = document.querySelector(".header_info");
        let chatList = state.arr.filter(e => {
            return ((e['chat_id'] < 1000) && (e["group"] == true))
        });
        let text = state.username + '&#013;';
        chatList.forEach(e => {text += e['username'] + '&#013;'});
        headerCount.innerHTML = '';
        headerCount.innerHTML =`<span title="${text}">Участники: ${chatList.length + 1}</span>`;
    }

    function renderLeftPanel(array = state.arr) {
          removeLeftPanel();
          let rightarray = [];
          let leftarray = [];             

          if ( state.currentchatid > 1000) {
            leftarray = array.filter(e => {
                return ((e['chat_id'] < 1000) && (e["group"] == false))
            });
            rightarray = state.arr.filter(e => {
                return ((e['chat_id'] < 1000) && (e["group"] == true))
            });
            calcGroupSize();
          }

          leftarray.forEach((user) => {
            leftPanel.innerHTML += `
                        <a href="#"><div class="sidebarleft_contact_chat" data-id="${user['contact_id']}">
                            <div class="sidebarleft_avatar">
                                <span class="avatar">
                                    <img class="avatar-photo" src="../assets/img/avatar/${user['avatar']}">
                                </span>
                                </div>
                                <div class="sidebarleft_title">
                                <div class="sidebarleft_owner">
                                    <span>${user['username']} </span>
                                </div>
                            </div>
                        </div></a>
                        `;
        });
        renderRightPanel(rightarray);   
    }

    function setState(id, status) {
        if(id) {
            state.arr.forEach(e => {
                if(e["chat_id"] == id) {
                    e["group"] = status;
                }
            });
        }
    }
      
    function renderRightPanel(array) {
        removeRightPanel();
        array.forEach((user) => {
            rightPanel.innerHTML += `
                        <a href="#"><div class="sidebarleft_contact_chat" data-id="${user['contact_id']}">
                            <div class="sidebarleft_avatar">
                                <span class="avatar">
                                    <img class="avatar-photo" src="../assets/img/avatar/${user['avatar']}">
                                </span>
                                </div>
                                <div class="sidebarleft_title">
                                    <div class="sidebarleft_owner">
                                        <span>${user['username']} </span>
                                    </div>
                                </div>
                            </div>
                        </a>
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
          setState(ItemIdContext, true);
          renderLeftPanel(state.arr, ItemIdContext);  
        });      
    }

    function RightListener() {
        rightPanel.addEventListener( "click", function(e) {
          let ItemIdContext  =  getIdOnClick(e);
          setState(ItemIdContext, false);
          renderLeftPanel(state.arr, ItemIdContext);  
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
          state.currentid  =  getIdOnClick(e);
          toggleMenuOff();
          e.preventDefault();
          menu = document.querySelector(".context-menu2");
          toggleMenuOn2();
          positionMenu(e);
          e.stopPropagation();
        });
      
    }
  
    function postListener() {
        divPost.addEventListener( "contextmenu", function(e) {
          if (getIdOnClick(e) != 0) {
            state.currentid  =  getIdOnClick(e);
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
    
    function toggleMenuOff() {
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
      //console.log( "Task ID - " + 
      //              state.currentid + 
      //              ", Task action - " + link.getAttribute("data-action"));
      toggleMenuOff();    
      switch (link.getAttribute("data-action")) {
        case "switch": 
          toogleAlarm(state.currentid);
          break;
        case "delete": 
          deleteMessage(state.currentid);
          break;
        case "edit": 
          editMessage(state.currentid);
          break;
        case "forward": 
          forwardMessage();
          break;
      }
    }
  
    function toogleAlarm(id) {
      const listContact = document.querySelector(".sidebarleft_body"); 
      let chatContact = listContact.querySelectorAll(".sidebarleft_contact_chat");
      chatContact.forEach((item) => {
          if (item.getAttribute("data-id") === id) {
              let alarmTag = item.querySelector("#alarm");
              if (alarmTag.className === "fa fa-bell-o") {
                  alarmTag.classList.remove("fa-bell-o");
                  alarmTag.classList.add("fa-bell-slash-o");
                  state.arr.forEach((el) => {
                    if(el["chat_id"] == id) {
                      el["alert"] = "off";
                    }    
                  });
              } else {
                  alarmTag.classList.remove("fa-bell-slash-o");
                  alarmTag.classList.add("fa-bell-o");
                  state.arr.forEach((el) => {
                    if(el["chat_id"] == id) {
                      el["alert"] = "on";
                    }    
                  });
              }      
          }
      });
    }
  
    function deleteMessage(id) {
      state.currentchat.forEach(e => {
        if(e['id'] == id) {
          e['message'] = setMessage(id, "<i>Сообщение удалено</i>");
          let index = state.currentchat.findIndex(e => e.id == state.currentid);
          state.currentchat[index]["message"] = "<i>Сообщение удалено</i>";
          // Сообщить серверу и другому пользователю
        }
      });
    }
  
    function editMessage(id) {
      state.currentchat.forEach(e => {
        if(e['id'] == id) {
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
          <div class="chatcontent_body chatcontent_body--my">
              <span class="chatcontent_mymessage_text"><b>${state.username}</b>: ${status}${newmessage}</span>
              <span class="chatcontent_mymessage_time">${getTimePost()}</span>
          </div>`;
       // Отправить другой стороне и в базу
    }
  
    function getTimePost() {
      const subbed = new Date();
      const hour = subbed.getHours().toString().length < 2 ? '0' + subbed.getHours() : subbed.getHours();
      const min = subbed.getMinutes().toString().length < 2 ? '0' + subbed.getMinutes() : subbed.getMinutes();
      return `${hour}:${min}`;
    }
  
    function addMessageInChat(message, chatID = state.currentchatid) {
      const newMessage = `
              <div class="chatcontent_mymessage_wrapper chatcontent_mymessage">
                  <div class="chatcontent_body chatcontent_body--my" data-id="${state.currentchat.length + 1}">
                      <span class="chatcontent_mymessage_text"><b>${state.username}</b>: ${message}</span>
                      <span class="chatcontent_mymessage_time">${getTimePost()}</span>
                  </div>
              </div>
      `;
      chatContext.insertAdjacentHTML("beforeend", newMessage);
      state.currentchat[state.currentchat.length] = {"id": state.currentchat.length + 1, "chat_id": Number(chatID), "send_id": state.userID, "message": message, "time": getTimePost()};
      // Отправить другой стороне и в базу
    }
  
    function addEditorListener() {
        listener1 = function(){
          if (inputSend.value !== '') {
              addMessageInChat(inputSend.value);
              inputSend.value = '';
              inputSend.focus();
          }
      };
        btnSend.addEventListener('click', listener1);
  
      listener2 = e => {
        if ((inputSend.value !== '') && (e.key === 'Enter')) {
            e.preventDefault();
            addMessageInChat(inputSend.value);
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
  
    function forwardMessage() {
        overlayDiv();
        windowTransferFlag = true;
        windowListChatTag.classList.add('active');
        renderforwardWindow();
    }
  
    function renderforwardWindow(array = state.arr) {
          let chatList = [];
          chatList = array.filter(e => {
                return ((e['chat_id'] < 1000));
            });
          listForward.innerHTML = '';
          chatList.forEach((user) => {
            if (user['chat_id'] != state.currentchatid) {
                  listForward.innerHTML += `
                        <a href="#"><div class="sidebarleft_contact_chat" data-id="${user['contact_id']}">
                            <div class="sidebarleft_avatar">
                                <span class="avatar">
                                    <img class="avatar-photo" src="../assets/img/avatar/${user['avatar']}">
                                </span>
                                </div>
                                <div class="sidebarleft_title">
                                <div class="sidebarleft_owner">
                                    <span>${user['username']} </span>
                                </div>
                            </div>
                        </div></a>
                  `;
            }
        });
    }
  
    function addForwardtListener() {
      listForward.addEventListener( "click", function(e) {
        e.stopPropagation();
        let ItemIdContext  =  getIdOnClick(e);
        state.currentchat.forEach(e => {
          if(e['id'] == state.currentid) {
             let message = "Forward->" + e['message'];
             state.currentchat[state.currentchat.length] = {"id": state.currentchat.length + 1, "chat_id": Number(ItemIdContext), "send_id": state.userID, "message": message, "time": getTimePost()};
            // Отправить другой стороне и в базу
             closeOverlay();
          }
        });
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
   

};

export default actionListeners;