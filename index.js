let db;
let currentRoomId;
let myId = 0;
const createRow = (id, msg) => {
  return `
    <tr>
      <td>${id}</td>
      <td>${msg}</td>
    </tr>
  `;
};
const updateMessageBody = (data) => {
  document.getElementById('msgBody').innerHTML = '';
  const reducer = (previousValue, id) => previousValue + createRow(id, data[id].value);
  document.getElementById('msgBody').innerHTML = Object.keys(data).reduce(reducer, '');
  // console.log(data);
  if(data[myId].isMyTurn) {
    document.getElementById('shuffle').style = 'display: block;'
  }else{
    document.getElementById('shuffle').style = 'display: none;'
  }

};
const shuffle = () => {
  const roomRef = db.collection('privateRoom').doc('game');
  const val = `${Math.floor(Math.random() * 6) + 1} ${String.fromCharCode(Math.floor(Math.random() * 7) + 65)}`
  const otherId = myId==='bacha' ? 'baobei' : 'bacha';
  roomRef.update({
    [myId]: {
      isMyTurn: false,
      value: val,
    },
    [otherId]: {
      isMyTurn: true,
      value: '',
    }
  });
};

const joinChannel =  async () => {
  const roomRef = db.collection('privateRoom').doc('game');
  const roomSnapshot = await roomRef.get();
  if (roomSnapshot.exists) {
    const data = roomSnapshot.data();
    updateMessageBody(data);
  }
  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    updateMessageBody(data);
  });
}


const initDbConnection = () => {
  var firebaseConfig = {
    apiKey: "apiKey",
    authDomain: "fir-rtc-8e4b2.firebaseapp.com",
    databaseURL: "https://fir-rtc-8e4b2.firebaseio.com",
    projectId: "fir-rtc-8e4b2",
    storageBucket: "fir-rtc-8e4b2.appspot.com",
    messagingSenderId: "messageSenderId",
    appId: "appId",
    measurementId: "mesID"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  db = firebase.firestore();
}

(function () {
  initDbConnection();
  let person = prompt("You want to play as bacha or baobei:", "baobei");
  if (person == null || person == "") {
  } else {
    myId = person;
    if (myId === 'bacha' || myId === 'baobei') {
      document.getElementById('welcome').innerHTML = `Welcome ${myId}`
    }
    else {
      document.getElementById('welcome').innerHTML = `You can not play Welcome`
    }
    
  }
  joinChannel();
})();
