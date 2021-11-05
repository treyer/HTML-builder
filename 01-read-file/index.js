const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(filePath, {encoding: "utf-8"});

stream.on("readable", () => {
        let data = stream.read();
        if (data) console.log(data);
})

stream.on("error", (error) => {
    if(error.code === "ENOENT"){
        console.log("File not found");
    } else {
        console.error(err);
    }
})