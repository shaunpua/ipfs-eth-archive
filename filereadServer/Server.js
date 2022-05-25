const express=require("express");
const app=express();
const cors = require("cors");

function cleanString(input) {
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;
}
//DOCX FILE DL
const fs = require ("fs")
const { types } = require('util')
const WordExtractor = require("word-extractor")
const getWordBodyText = async (fileName)=>{
    try {
        if(fs.existsSync(fileName)){
            const extractor = new WordExtractor()
            const extracted = await extractor.extract(fileName)
            if(extractor) {
                return extracted.getBody();

            }
        }

    } catch (error) {
        return error.message
    }
}
//DOCX FILE DL END

//DL File
const download = require('download');
//DL File END

//DL PDF
const pdf = require("pdf-parse");
//DL PDF END

app.use(express.json());
app.use(cors());
app.post("/dlDocxFile",async(req,res)=>{
    var url=req.body.fileURL;
    console.log("dl url: "+url);
    urlFull="https://ipfs.infura.io/ipfs/"+url;
    const filePath = './files';
    await download(urlFull,filePath)
    .then(() => {
        console.log('Download Completed');
    })
    var filelocation="./files/"+String(url)+".docx";
    console.log("dl file path: "+filelocation);
    var filecontents=await getWordBodyText(filelocation).then(content => {

        console.log("DOCX file READ")
        return content;
    }).catch(errMsg => {
        return error.message;
    });
    filecontents=cleanString(filecontents);
    console.log("to be sent data: "+filecontents)
    fs.unlink(filelocation, function(){
        console.log("File was deleted") 
    });
    res.send({filecontents:filecontents})
})

app.post("/dlPDFFile",async(req,res)=>{
    var url=req.body.fileURL;
    console.log("dl url: "+url);
    urlFull="https://ipfs.infura.io/ipfs/"+url;
    const filePath = './files';
    await download(urlFull,filePath)
    .then(() => {
        console.log('Download Completed');
    })
    var filelocation="./files/"+String(url)+".pdf";
    console.log("dl file path: "+filelocation);
    var dataBuffer = fs.readFileSync(filelocation);
    var filecontents=await pdf(dataBuffer).then(function(data) {
  
        // // number of pages
        // console.log(data.numpages);
        // // number of rendered pages
        // console.log(data.numrender);
        // // PDF info
        // console.log(data.info);
        // // PDF metadata
        // console.log(data.metadata); 
        // // PDF.js version
        // // check https://mozilla.github.io/pdf.js/getting_started/
        // console.log(data.version);
        // PDF text
        return data.text;
            
    
        }).catch(errMsg => {
        return error.message;
    });
    filecontents=cleanString(filecontents);
    console.log("to be sent data: "+filecontents)
    fs.unlink(filelocation, function(){
        console.log("File was deleted") 
    });
    res.send({filecontents:filecontents})

})

function chunk(s, maxBytes) {
    /*
      buf.slice([start[, end]])
      start <integer> Where the new Buffer will start. Default: 0.
      end <integer> Where the new Buffer will end (not inclusive). Default: buf.length.
      Returns: <Buffer>
    */
  
    let buf = Buffer.from(s);  
    const result = [];
    let readBuffer = true
    let startChunkByte = 0
    let endChunkByte = maxBytes
    while(readBuffer) {
      // First round
      startChunkByte === 0 ? endChunkByte = startChunkByte + maxBytes : ""
  
      //Handle last chunk
      endChunkByte >= buf.length ? readBuffer = false : ""
  
      // addr: the position of the first bytes.  raw: the chunk of x bytes
      result.push({"addr":startChunkByte,"raw":buf.slice(startChunkByte, endChunkByte).toString()});
    //result.push({"addr":startChunkByte,"raw":buf.slice(startChunkByte, endChunkByte).toString('hex')});

      startChunkByte = endChunkByte
      endChunkByte = startChunkByte + maxBytes
    }
    return result;
  }

app.post("/dlnonUTF",async(req,res)=>{
    var url=req.body.fileURL;
    var ext=req.body.fileEXT;
    console.log("dl url: "+url);
    console.log("dl ext: "+ext);
    urlFull="https://ipfs.infura.io/ipfs/"+url;
    const filePath = './files';
    await download(urlFull,filePath)
    .then(() => {
        console.log('Download Completed');
    })
    var filelocation;
    if(String(ext)=="txt")
    {
        filelocation="./files/"+String(url);
    }
    else{
        filelocation="./files/"+String(url)+"."+String(ext);
    }
    console.log("dl file path: "+filelocation);
    var dataBuffer = fs.readFileSync(filelocation);
    var filecontents=await chunk(dataBuffer, 512)
   
    console.log("to be sent data: "+filecontents)
    fs.unlink(filelocation, function(){
        console.log("File was deleted") 
    });
    res.send({filecontents:filecontents})
})

app.listen(3001,()=>{
    console.log("Server runs on port 3001");
});