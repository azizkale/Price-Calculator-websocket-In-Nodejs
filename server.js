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
    //all data from mobile device are saved in the Products.txt file======
    //and no data from PC has ID
    if (json.ID == "") {
      fs.appendFile("Products.txt", "\n" + msg, function (err) {
        if (err) {
          // append failed
        } else {
          // done
        }
      });
    }

    //
    //

    //
    //
    //======================================================================
    // if the data comes from PC this data is deleted from Products.txt file
    if (json.ID != "") {
      lineReader.eachLine("Products.txt", async function (line) {
        if (line != "") {
        }
      });
    }
    //
    //
    // Broadcast that message to all connected clients==========
    wsServer.clients.forEach(function (client) {
      // the only messages from Mobile Device are boradcasted
      // the messages from PC are not broadcasted
      if (json.ID == "") {
        client.send(msg);
      }
    });
    //==========================================================
    //
    //
  });

  socket.on("close", function () {
    console.log("Client disconnected");
  });
});

console.log("Server is listening on port " + PORT);
