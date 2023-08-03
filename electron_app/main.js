const { app, BrowserWindow } = require('electron');
const { join } = require('path');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

function createWindow() {
    const win = new BrowserWindow({
      width: 800,
      height: 700
    })
  
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

function chat(prompt, ws) {
    const llama2 = "/Users/moacirbrg/Desktop/llama/llama_project/llama.cpp/main";
    const fullPrompt = 
        `[INST] Rule for answering the following propmpt. Always answer in markdown, always add the language with the \`\`\`. For one line snippets, also add it.\n\n ${prompt} [/INST]`;

    const params = [
        '--threads', '8',
        '--n-gpu-layers', '1',
        '--model', '/Users/moacirbrg/Desktop/llama/llama_project/llama.cpp/llama-2-13b-chat.ggmlv3.q4_0.bin',
        '--ctx-size', '2048',
        '--temp', '0.7',
        '--repeat_penalty', '1.1',
        '--n-predict', '-1',
        '--verbose-prompt',
        '--prompt', fullPrompt
    ];
    
    const child = require('child_process').spawn(llama2, params);
    
    const fullPromptBytes = fullPrompt.length + 2;
    let bytesCounter = 0;
    let answerAlreadyStarted = false;

    child.stdout.on('data', (data) => {
        if (answerAlreadyStarted) {
            ws.send(data.toString('utf8'));
            return;
        }

        if ((data.length + bytesCounter) < fullPromptBytes) {
            bytesCounter += data.length;
            return;
        } else {
            answerAlreadyStarted = true;
            const answer = data.slice(fullPromptBytes - bytesCounter);
            ws.send(answer.toString('utf8'));
        }
    });
    
    child.stderr.on('data', (data) => {
        // DO NOTHING
    });
    
    child.stdout.on('end', () => {
        ws.close();
    });
}

const express_app = express();
const server = http.createServer(express_app);

express_app.use(cors());

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        chat(message, ws);
    });
});

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});