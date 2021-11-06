const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, "styles");
const destinationDir = path.join(__dirname, "project-dist");

const mergeStyleFiles = async (sourceDir, destinationDir) => {
    try {
        const writeableStream = fs.createWriteStream(path.join(destinationDir, "bundle.css"));

        const files = await fs.promises.readdir(sourceDir);
        for (let file of files){
            fs.stat(path.join(sourceDir, path.basename(file)), (err, stats) => {
                if (err) {
                    throw err;
                }
                if (stats.isFile() && path.extname(file) === ".css"){
                    let readableStream = fs.createReadStream(path.join(sourceDir, path.basename(file)), "utf8");
                    readableStream.pipe(writeableStream);
                }
            })
        }
    } catch (err){
        console.error(err);
    }
}

mergeStyleFiles(sourceDir, destinationDir);