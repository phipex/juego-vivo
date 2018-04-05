/* eslint-disable no-use-before-define,no-console */
const connection = new WebSocket('ws://localhost:8585');
const webview = document.querySelector('webview');
const balance = document.querySelector('#balance-val');
//const URL = 'https://doradobet.com/productos/betshop/';
const URL = 'https://doradobet.com/productos/betshop2/';
const URLBASE = 'http://localhost:8181';
//const URLBASE = 'http://192.168.1.240:8080/rutavivo';
const URLBALANSE =  URLBASE + '/api/counters/machine/balance';
const URLCASHOUT = URLBASE + "/api/even-logs/machine/cashout";

console.log(webview);

setInterval(getBalance, 1000);

webview.addEventListener('did-navigate-in-page', getBalance);

//did-navigate-in-page

//webview.addEventListener('close', )

//webview.addEventListener('console-load-commit', getBalance);
//webview.addEventListener('finish-load', getBalance);
//webview.addEventListener('dom-ready', getBalance);
//webview.addEventListener('dom-ready', getBalance);

// When the connection is open, send some data to the server
connection.onopen = function onopen() {
  //connection.send('Ping'); // Send the message 'Ping' to the server
  getBalance();

};

// Log errors
connection.onerror = function onerro(error) {
  console.log(`WebSocket Error ${error}`);
};

// Log messages from the server
connection.onmessage = function onmessage(e) {
  console.log(`Server: ${e.data}`);
  gestionMensaje(e.data);
};

function gestionMensaje(msg) {
  const NEWBALANCE = 'NEWBALANCE';
  const RESTART = 'RESTART';
  const COBRAR = 'BTN1';
  const MENU = 'BTN2';

  switch (msg) {
    case NEWBALANCE: {
      getBalance();
      break;
    }
    case RESTART: {
          // TODO reiniciar todo

      webview.loadURL(URL);
      break;
    }
    case COBRAR: {
          // TODO cobrar saldo
      cashout();
      break;
    }
    case MENU: {
          // TODO regresar al inicio
      webview.loadURL(URL);
      break;
    }
    default : {
          // TODO actualizar saldo
      getBalance();
      break;
    }

  }
}



const numberWithCommas = (x) => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

function getBalance(){
  var data = null;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      var balacenObject = JSON.parse(this.responseText);
      if(balacenObject.balance){
        console.log(balacenObject.balance);
        balance.innerHTML = numberWithCommas(balacenObject.balance);
      }
    }
  });

  xhr.open("GET", URLBALANSE);
  //xhr.open("GET", "http://192.168.1.240:8181/api/counters/machine/balance");
  xhr.setRequestHeader("Cache-Control", "no-cache");
  //xhr.setRequestHeader("Postman-Token", "1e55cbfb-eebe-4205-95bb-0fe4f5c89237");

  xhr.send(data);
}

function cashout(){
  connection.send('CASHOUT');
  requestCashout();
}

function requestCashout(){
  var data = "vivo";

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      getBalance();
    }
  });

  xhr.open("POST", URLCASHOUT);
  xhr.setRequestHeader("Cache-Control", "no-cache");
  //xhr.setRequestHeader("Postman-Token", "95a4698c-e493-4bc7-ae41-5ad1f0649e72");

  xhr.send(data);

}

