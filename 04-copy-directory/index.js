const fs = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, "files");
const destinationFolder = path.join(__dirname, "files-copy");

let copyDir = async (sourceFolder, destinationFolder) => {
    try{
        await fs.promises.rm(destinationFolder, { recursive: true, force: true });
        await fs.promises.mkdir(destinationFolder, { recursive: true });
        //copy files
        fs.promises.readdir(sourceFolder)
        .then(filenames => {
            for (let filename of filenames) {
                let sourceFilePath = path.join(sourceFolder, filename);
                let destFilePath = path.join(destinationFolder, filename);

                fs.copyFile(sourceFilePath, destFilePath, (err) => {
                    if (err) throw err;
                });   
            }
        })
        .catch(err => {
            throw err;
        })
    } catch (err){
        console.error(err);
    }
}

copyDir (sourceFolder, destinationFolder);