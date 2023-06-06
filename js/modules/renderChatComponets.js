const renderChatComponets = (state) => {

    const layerChatList = document.querySelector(".sidebarleft_body"); 
    const chatContext = document.querySelector(".chatcontent"); 

    init();
    
    function init() {
        renderChatList(state.arr);
        reloadHeaderClickChat(state.arr[0]['chat_id']);
        filterChatList();
        clickChatList();
    }

    function reloadHeaderClickChat(id) {
        state.currentchatid = id;
        let user = state.arr.filter(e => {return e['chat_id'] == id });
        const header = document.querySelector(".header_wrapper"); 
        const control = document.querySelector(".header_right"); 
       
        if (state.currentchatid < 1000) {
            header.innerHTML =
            `
            <div class="header_avatar">
                    <img class="avatar-photo" src="../assets/img/avatar/${user[0]['avatar']}">
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
                <img class="avatar-photo" src="../assets/img/avatar/${user[0]['avatar']}">
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
        uploadChat(id);
       // uploadLeftPanel();
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

    function uploadChat(id) {
        removeChat();
        state.currentchat.forEach((arr) => {
            if (arr['chat_id'] == id) {
                if (arr['send_id'] == state["userID"]) {
                    chatContext.innerHTML += `
                        <div class="chatcontent_mymessage_wrapper chatcontent_mymessage" data-id="${arr["id"]}">
                            <div class="chatcontent_body chatcontent_body--my">
                                <span class="chatcontent_mymessage_text"><b>${state.username}</b>: ${arr['message']}</span>
                                <span class="chatcontent_mymessage_time">${arr['time']}</span>
                            </div>
                        </div>
                    `;
                }
                if (arr['send_id'] == id) {
                    chatContext.innerHTML += `
                        <div class="chatcontent_mymessage_wrapper chatcontent_yourmessage" data-id="0">
                            <div class="chatcontent_body">
                                <span class="chatcontent_yourmessage_text">${arr['message']}</span>
                                <span class="chatcontent_yourmessage_time">${arr['time']}</span>
                            </div>
                        </div>
                    `;
                }
            }
        });
    }

    function removeChat() {
        chatContext.innerHTML = ``;
   }

    function clickChatList() {
        layerChatList.addEventListener("click", function(e) {
            let node = e.target.parentNode;
            let id;
            do {
                id = node.getAttribute("data-id");
                node = node.parentNode;
            } while (!id)
            if(id) {
                reloadHeaderClickChat(id);
            }
        });
    }

    function renderChatList(array) {
        removeChatList();
        sortChatList();
        array.forEach((user) => {
            if ((user['id'] == state.userID)) {
                    let alert = user['alert'] === 'on' ? "fa-bell-o" : "fa-bell-slash-o";
                    layerChatList.innerHTML += `
                    <div class="sidebarleft_contact_chat" data-id="${user['contact_id']}">
                        <div class="sidebarleft_avatar">
                            <span class="avatar">
                                <img class="avatar-photo" src="../assets/img/avatar/${user['avatar']}">
                                <span class="status" data-status="${user['status']}"></span>
                            </span>
                            </div>
                            <div class="sidebarleft_title">
                            <div class="sidebarleft_owner">
                                <span>${user['username']} </span><i class="fa ${alert}" id="alarm"></i>
                            </div>
                            <div class="sidebarleft_lastpost">
                                <span>${user['email']}</span>
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