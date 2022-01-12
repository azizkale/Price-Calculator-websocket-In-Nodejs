const WebSocket = require("ws");
const PORT = 5000;
const wsServer = new WebSocket.Server({
  port: PORT,
});

const lineReader = require("line-reader");
const fs = require("fs");
let json;

wsServer.on("connection", async function (socket, req) {
  // Some feedback on the console
  console.log("A client just connected");

  // Attach some behavior to the incoming socket
  await socket.on("message", function (msg) {
    console.log("Received message from client: " + msg);
    //
    json = JSON.parse(msg);
    //
    //if data came from Mobile device while PC is close
    // the data are saved on server. and once the pc is opened, data go to the PC by the request from PC with the info "requestInfo=connectingReq"
    if (fs.existsSync("Products.txt") && json.requestInfo == "connectingReq") {
      //if there is a Products.txt file, data of this file are sent to PC
      lineReader.eachLine("Products.txt", (line, last) => {
        try {
          if (line != "") {
            wsServer.clients.forEach(async function (client) {
              await client.send(line);
            });
          }
        } catch {}
      });
    }

    //all data from mobile device are saved in the Products.txt file======
    //and no incoming data from PC has ID

    switch (json.requestInfo) {
      case "appReq":
        fs.appendFile("Products.txt", "\n" + msg, function (err) {
          if (err) {
            // append failed
          } else {
            // done
          }
        });
        wsServer.clients.forEach(function (client) {
          client.send(msg);
        });
        break;

      // if the saved data were sent to PC then the file Product.txt is removed from server
      case "insertingReq":
        if (fs.existsSync("Products.txt")) {
          fs.unlink("Products.txt", (hata, data) => {
            if (hata) {
              throw hata;
            }
          });
        }
        break;
    }
  });

  socket.on("close", function () {
    console.log("Client disconnected");
  });
});

console.log("Server is listening on port " + PORT);
