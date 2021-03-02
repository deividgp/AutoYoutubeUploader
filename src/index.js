const { google } = require('googleapis');
const service = google.youtube('v3');
const fs = require('fs');
const readline = require('readline');
const Youtube = require('./youtube.js');
var youtube = new Youtube();
var myArgs = process.argv.slice(2);
var playlists = [];

if(myArgs[2] != undefined){
    const playlistLine = readline.createInterface({
        input: fs.createReadStream(myArgs[2]),
        output: process.stdout,
        terminal: false
    });
    var i = 0;
    playlistLine.on('line', (line) => {
        playlists[i] = line;
        console.log(playlists[0])
        i++;
    });

    playlistLine.on('close', () =>{
        options();
    });
}else{
    options();
}

function options(){
    switch (myArgs[0]) {
        case "f":
            const folderLine = readline.createInterface({
                input: fs.createReadStream(myArgs[1]),
                output: process.stdout,
                terminal: false
            });
    
            folderLine.on('line', (line) => {
                var path = line.replace(/\\/g, "\\\\");
                
                watchFolder(path);
            });
            break;
        case "p":
            var path = myArgs[1].replace(/\\/g, "\\\\");
    
            watchFolder(path);
            
            break;
    }
}

function watchFolder(path){
    fs.watch(path, (eventType, filename) => {
        if(eventType == "rename"){
            console.log(path + "\\\\" + filename);
            youtube.runYoutube(path + "\\\\" + filename);
        }
    });
}