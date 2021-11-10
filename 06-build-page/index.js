const fs = require('fs');
const path = require('path');

const destinationDir = path.join(__dirname, "project-dist");
const stylesSourceDir = path.join(__dirname, "styles");
const assetsSourseDir = path.join(__dirname, "assets");
const assetsDestinationDir = path.join(destinationDir, "assets");
const indexFile = path.join(destinationDir, 'index.html');
const indexFileTemplate = path.join(__dirname, 'template.html');
const componentsSourcePath = path.join(__dirname, 'components');

const createFolders = () => {
    try{
        fs.mkdir(destinationDir, {recursive: true}, (err) => {if (err) throw err});
        fs.mkdir(path.join(destinationDir, "assets"), {recursive: true}, (err)=>{if (err) throw err});
    } catch (err){
        console.error("Error creating folders");
    }
}

const mergeStyleFiles = async (sourceDir, destinationDir) => {
    try {
        const writeableStream = fs.createWriteStream(path.join(destinationDir, "style.css"));

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
        console.error("Error creating styles file");
    }
}

const copyAssetsDir = async (sourseDir, destDir) =>{
    try{
        const files = await fs.promises.readdir(sourseDir);

        for(let file of files){
            fs.stat(path.join(sourseDir, file), (err, stats) => {
                if(err) throw err;
                
                if (stats.isFile()) {
                    fs.promises.copyFile(path.join(sourseDir, file), path.join(destDir, file));
                }
                else {
                    fs.mkdir(path.join(destDir, file), {recursive: true}, (err) => {
                        if (err) throw err;
                    });
                    copyAssetsDir(path.join(sourseDir, file), path.join(destDir, file));
                }
            });
        };
    } catch(err){
        console.error("Error copying assets folder with files");
    }
}

const createIndexFile = async () => {
    const readStream= fs.createReadStream(indexFileTemplate, 'utf8');
    const writeStream = fs.createWriteStream(indexFile)
    
    readStream.on('data', async (data) => {
        const replacedData = await replaceTags(data.toString());
        writeStream.write(replacedData);
    });
}

const replaceTags = async (templateData) => {
    const componentsFiles = await fs.promises.readdir(componentsSourcePath);
    const htmlFiles = componentsFiles.filter(file => path.extname(file) === '.html');
    for (let htmlComponent of htmlFiles) {
        const htmlComponentData = await fs.promises.readFile(path.join(componentsSourcePath, htmlComponent));
        const name = path.basename(htmlComponent, '.html');
        let canReplace = true;
        while(canReplace){
            if(templateData.indexOf(`{{${name}}}`) !== -1){
                templateData = templateData.replace(`{{${name}}}`, htmlComponentData);
            } else {
                canReplace = false;
            }
        }
    }
    return templateData;
}

createFolders();
mergeStyleFiles(stylesSourceDir, destinationDir);
copyAssetsDir(assetsSourseDir, assetsDestinationDir);
createIndexFile();