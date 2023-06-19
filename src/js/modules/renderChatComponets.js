const renderChatComponets = (state) => {

    const layerChatList = document.querySelector(".sidebarleft_body"); 
    const chatContext = document.querySelector(".chatcontent"); 

    init();
    
    function init() {
        renderChatList(state.arr);
        filterChatList();
        clickChatList();
        uploadMyAvatar();
        uploadMyNick();
        reloadHeaderClickChat(state.arr[0]['chat_id']);
    }

    function uploadMyAvatar() {
        const blockMyAvatar = document.querySelector(".myavatar");
        blockMyAvatar.innerHTML =
        `
            <img class="myavatar-photo" src="${state.urlImg}${state.avatar}">
            <div class="camera"><a href="/upload" title="Сменить аватар">
                <i class="fa fa-camera-retro icon-camera"></i>
            </a></div>
        `;
    }

    function uploadMyNick() {
        const blockMyNick = document.querySelector(".mynick");
        blockMyNick.innerHTML =
        `
            <a href="/update" title="Редактировать профиль">${state.username}</i></a>
        `;
    }

    function reloadHeaderClickChat(id) {
        state.currentchatid = id;
        let user = state.arr.filter(e => {return e['chat_id'] == id });
        const header = document.querySelector(".header_wrapper"); 
        const control = document.querySelector(".header_right"); 
       
        if (state.currentchatid < 10000) {
            header.innerHTML =
            `
            <div class="header_avatar">
                    <img class="avatar-photo" src="${state.urlImg}${user[0]['avatar']}">
            </div>
            <div class="header_title">
                <div class="header_owner">
                    <span>${user[0]['username']}</span>
                </div>
                <div class="header_info">
                    <span>Был(а) недавно</span>
                </div>
            </div>
            `;
            control.style = "opacity: 0";
        } else {
            header.innerHTML =
            `<div class="header_avatar">
                <img class="avatar-photo" src="${state.urlImg}${user[0]['avatar']}">
             </div>
             <div class="header_title">
                <div class="header_owner">
                    <span>${user[0]['username']}</span>
                </div>
                <div class="header_info">

                </div>
             </div>
            `;
            calcGroupSize();
            control.style = "opacity: 1";
        }
        if ((state.currentchatid < 10001) || ((state.currentchatid = 10001) && (state.groupStatusMyUser == 1))) {
            uploadChat(id);
        }
       // uploadLeftPanel();
    }

    function calcGroupSize() {
        let headerCount = document.querySelector(".header_info");
        let chatList = state.listgroup.filter(e => e["group_status"] == 1);
        let text = ''; //state.username + '&#013;';
        chatList.forEach(e => {text += e['username'] + '&#013;'});
        headerCount.innerHTML = '';
        headerCount.innerHTML =`<span title="${text}">Участники: ${chatList.length}</span>`;
    }

    function uploadChat(chatId) {
        removeChat(); 
        const array = state.currentchat.filter(item => item['chat_id'] == chatId);
        array.forEach((arr) => {
                if (arr['sender_id'] == state.userID) { 
                    chatContext.innerHTML += `
                        <div class="chatcontent_mymessage_wrapper chatcontent_mymessage" data-id=${arr["id"]}>
                            <div class="chatcontent_body chatcontent_body--my">
                                <span class="chatcontent_mymessage_text">${state.username}: ${arr['message']}</span>
                                <span class="chatcontent_mymessage_time">${arr['time_message']}</span>
                            </div>
                        </div>
                    `;
                } else {
                    chatContext.innerHTML += `
                        <div class="chatcontent_mymessage_wrapper chatcontent_yourmessage" data-id=${arr["id"]}>
                            <div class="chatcontent_body">
                                <span class="chatcontent_yourmessage_text">${arr['message']}</span>
                                <span class="chatcontent_yourmessage_time">${arr['time_message']}</span>
                            </div>
                        </div>
                    `;
                }
        });
    }

    function removeChat() {
        chatContext.innerHTML = ``;
   }

    function clickChatList() {
        layerChatList.addEventListener("click", function(e) {
            let node = e.target;
            let id;
            do {
                hasAttr(node, "data-id") ? id = node.getAttribute("data-id") : node = node.parentNode;
            } while (!id);
            if(id) {
                reloadHeaderClickChat(id);
            }
        });
    }

    function hasAttr(element, attr) {
        if(typeof element === 'object' && element !== null && 'getAttribute' in element  && element.hasAttribute(attr)) {
          return true;
        } else {
          return false;
        }
    }

    function setAlarm(array) { 
        if ((array['id1'] == state.userID) && (state.userID != 10001)) {
             return array['alarm2'] == 1 ?  "fa-bell-o" : "fa-bell-slash-o";
        } else {
             return array['alarm1'] == 1 ?  "fa-bell-o" : "fa-bell-slash-o";
        }
    }

    function renderChatList(array) { 
        removeChatList();
       // sortChatList(); Сортировка чатов по времени сообщений
        array.forEach((user) => {  
            if ((user['id1'] == state.userID) || (user['id2'] == state.userID) || (user['id1'] == 10001)) { 
                   // let alert = ((user['alarm1'] == 1 && user['id1'] == state.userID) || (user['alarm2'] == 1 && user['id2'] == state.userID) ||  (user['alarm1'] == 1 && user['id1'] == 10001)) ? "fa-bell-o" : "fa-bell-slash-o";
                    let alarm = setAlarm(user);
                    let email = user['email_status'] == 0 ? 'Скрыт' : user['email'];
                    layerChatList.innerHTML += `
                    <div class="sidebarleft_contact_chat" data-id="${user['chat_id']}">
                        <div class="sidebarleft_avatar">
                            <span class="avatar">
                                <img class="avatar-photo" src="${state.urlImg}${user['avatar']}">
                                <span class="status" data-status="on"></span> 
                            </span>
                            </div>
                            <div class="sidebarleft_title">
                            <div class="sidebarleft_owner">
                                <span>${user['username']} </span><i class="fa ${alarm}" id="alarm"></i><span class="blink"></span> 
                            </div>
                            <div class="sidebarleft_lastpost">
                                <span>${email}</span>
                            </div>
                        </div>
                    </div>
                    `;
            }
        });

    }

    function removeChatList() {
         layerChatList.innerHTML = ``;
    }

    function sortChatList() {
        state.arr.sort((a, b) => b.lasttime > a.lasttime ? 1 : -1);
    }

    function filterUserName(value, array) {
        return array.filter(it => it['username'].toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
    
    function filterChatList() {
            let search = document.querySelector("#search");
            search.addEventListener("input", e => {
                renderChatList(filterUserName(e.target.value, state.arr));
            });
    }
    
};

export default renderChatComponets;