const http = require("http");
const fs = require("fs");
const PORT = process.env.PORT || 4000;
//creatingServer
const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    console.log(req.method);
    fs.readFile("./database.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log(data);
      res.end(data);
    });
  }

  // POST || create
  if (req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      fs.appendFile("./database.json", data, (err, data) => {
        if (err) {
          console.log(err);
        }
        res.end("error in writing file");
        return;
      });

      res.end("data written successfully");
    });
  }

  //PUT || update
  if (req.method === "PUT") {
    let dataPool = "";

    req.on("data", (chunk) => {
      dataPool += chunk;
    });

    req.on("end", () => {
      fs.readFile("./database.json", "utf8", (err, data) => {
        if (err) {
          throw err;
        }
        const newValue = data.replace(/id/g, dataPool);

        fs.writeFile("./database.json", newValue, "utf8", (err, data) => {
          if (err) throw err;
          console.log("file updated");
        });

        res.end("file updated");
      });
    });
  }
  //DELETE || REMOVE

  if (req.method === "DELETE" && req.url.startsWith("/user/")) {
    const userId = req.url.split("/")[2]; // Extract the ID from the URL

    fs.readFile("./database.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);

        res.end("Error reading database file");

        return;
      }

      const newData = JSON.parse(data);

      for (data in newData) {
        if (data === userId) {
          newData.splice(data, 1);
        }
      }

      const newEst = JSON.stringify(newData);

      fs.writeFile("./database.json", newEst, "utf8", (err) => {
        if (err) {
          console.log(err);

          res.end("Error writing to database file");

          return;
        }

        res.end("Record deleted successfully");
      });
    });
  }
});
server.listen(PORT, () => {
  console.log(`server is listening on PORT: ${PORT}`);
});
