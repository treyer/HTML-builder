const fs = require('fs');
const path = require('path');

const showFilesData = async () => {
    const dirPath = path.join(__dirname, "secret-folder");

    try {
        const files = await fs.promises.readdir(dirPath);
        for (let file of files){
            let extName = path.extname(file);
            let fileName = path.basename(file, extName);
            fs.stat(path.join(__dirname, "secret-folder", path.basename(file)), (err, stats)=>{
                if (err) {
                    throw err;
                }
                if (stats.isFile()){
                    console.log(`${fileName} - ${extName.slice(1)} - ${stats.size / 1000}kb`);
                }
            })
        }
    } catch (err){
        console.error(err);
    }
}

showFilesData();

