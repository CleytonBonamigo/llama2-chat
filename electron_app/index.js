const markdownConverter = new showdown.Converter();

const chatEl = document.getElementById('chat');
const sendBtn = document.getElementById('send');
const promptField = document.getElementById('prompt');

send.addEventListener('click', function (event) {
    chat(promptField.value);
});

function chat(prompt) {
    chatEl.textContent = '';

    const socket = new WebSocket('ws://localhost:8080');

    socket.addEventListener('open', function (event) {
        socket.send(prompt);
    });
    
    let fullMessage = '';

    socket.addEventListener('message', function (event) {
        fullMessage += event.data;
        chatEl.innerHTML = markdownConverter.makeHtml(fullMessage);
        hljs.highlightAll();
    });

    socket.addEventListener('close', function (event) {
        console.log(fullMessage);
        socket.close();
    });
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}