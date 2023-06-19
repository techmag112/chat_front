const getState = (state) => {

    const dop = '/index.php';

    function getUser() { 
        axios.get('/getuserdata' + dop)
        .then(res => { 
            setData(res.data[0].id, 'userID');
            setData(res.data[0].username, 'username');
            setData(res.data[0].avatar, 'avatar');
        })
        .catch(function(error) {
            console.log(error);
        });
    };

    function getListChats() {
        axios.get('/getchatlist' + dop)
        .then(res => {
            let Arr = Object.entries(res.data);
            let i = 1
            Arr.forEach((item, i) => {
                setList(item[1], [i+1]);
            });
            console.log('state.arr', state.arr);
    });
    }

    function getChatMessages()  {
        axios.get('/getchatmessages' + dop)
        .then(res => {
            let Arr = Object.entries(res.data);
            Arr.forEach((item, i) => {
                setMessage(item[1], [i]);
            });
            console.log('state.currentchat', state.currentchat);
        });
    }

    function getListGroup() {
        axios.get('/getlistgroup' + dop)
        .then(res => {
            let Arr = Object.entries(res.data); 
            Arr.forEach((item, i) => {
                if (item[1]['id'] == state.userID) {
                    state.groupStatusMyUser = item[1]['group_status'];
                    console.log('state.groupStatusMyUser ', state.groupStatusMyUser);
                  }
                setListGroup(item[1], [i]);
            });
            console.log('state.listgroup', state.listgroup);
    });
    }

    function setData(arg, field) {
        state[field] = arg;
        console.log(field, state[field]);
    }

    function setMessage(arg, field) {
        state.currentchat[field] = arg;
    }

    function setList(arg, field) {
        state.arr[field] = arg;
    }

    function setListGroup(arg, field) {
        state.listgroup[field] = arg;
    }

    getUser();
    getListGroup();
    getListChats(); 
    getChatMessages();

};

export default getState;