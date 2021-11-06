const fs = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, "files");
const destinationFolder = path.join(__dirname, "files-copy");

let copyDir = (sourceFolder, destinationFolder) => {
    try{
        //check if destination folder exists, create if not
        fs.access(destinationFolder, err => {
            if (err) {
              fs.mkdir(destinationFolder, err => {
                if(err) throw err;
              })
            }
        })
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