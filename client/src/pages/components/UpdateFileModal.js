import React, {useContext, useState, useEffect} from "react";
import BlockchainContext from "../../BlockchainContext";
//const Axios = require('axios');
import Axios from "axios";

const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 
const ipfs = ipfsClient.create('https://ipfs.infura.io:5001/api/v0') 
function cleanString(input) {
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;
}

function UpdateFileModal(props) {
    const [filedata, setFiledata] = useState(null);
    const [filetype, setfileType] = useState(null);
    const [filename, setfileName] = useState(null);
    const [fullfilename, setFullfilename] = useState(null)
    const [buffer, setBuffer] = useState(null);

    //button disable states
    const [updateDisable, setUpdateDisable] = useState(false);
    const [selectDisable, setSelectDisable] = useState(true);


    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    //get the file extension of the new updated file
    const [file_ext_new, setfileExtNew] = useState(null);

    useEffect(() => {
        console.log('FILE DATA:', filename, filetype);
        console.log('buffer: ', buffer);
        console.log('newfile ext:',file_ext_new);
    }, [filetype,filename, buffer,file_ext_new]);


    const closeModalFunc = () =>{
        props.closeModal(false)
    }

    const captureFile = event => {
        event.preventDefault()
    
        const file = event.target.files[0]
        console.log(file)
        const reader = new window.FileReader()

        // const fileData = contract.methods.files(props.fileIndex).call();
        // setFiledata(fileData);
        // console.log(fileData);
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            setBuffer(Buffer(reader.result));
            setfileType(file.type);
            const fileNameFilter = file.name.split(".")
            setFullfilename(file.name)
            setfileName(fileNameFilter[0]);
            var fileExtVal=file.name.split(".");
            setfileExtNew(fileExtVal[1]);
            setSelectDisable(false);
            
        }
      }
      

      const updateFile = async (e) => {
        
        e.preventDefault();
        setUpdateDisable(true);
        try {
            const uploadResult = await ipfs.add(Buffer.from(buffer));
            console.log(uploadResult);
            console.log('ipfs data', uploadResult.path, uploadResult.size);

            // if(filetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            //     setfileType('.docx');
            // }
             //console log the file content of the new updated file
             let contents_new = ""
             // loop over incoming data
            if(file_ext_new==="txt"){
                for await(const item of ipfs.cat(uploadResult.path)){
                    // turn string buffer to string and append to contents
                    contents_new += new TextDecoder().decode(item)
                }
                contents_new=cleanString(contents_new);
                console.log('New File Content:'+contents_new);
            }
            else if(file_ext_new==="docx"){
                await Axios.post("http://localhost:3001/dlDocxFile",{fileURL:uploadResult.path}).then((response)=>{
            
                    contents_new = response.data.filecontents;
                });
 
            }
            else if(file_ext_new==="pdf"){
               
                await Axios.post("http://localhost:3001/dlPDFFile",{fileURL:uploadResult.path}).then((response)=>{
               
                    contents_new = response.data.filecontents;
                });
        
            }
            const fileData = await contract.methods.files(props.fileIndex).call();
            
            setFiledata(fileData);
            console.log('pulled fila data', fileData.fileHash, fileData.fileName);
            let contents_old = ""
            var oldfileExt=fileData.fileType;
        
            console.log("Old file's extension: "+oldfileExt);
            if(oldfileExt==="text/plain"){
                for await(const item of ipfs.cat(fileData.fileHash)){
                    contents_old += new TextDecoder().decode(item)
                }
                contents_old=cleanString(contents_old);
            }
            else if(oldfileExt==="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
           
                await Axios.post("http://localhost:3001/dlDocxFile",{fileURL:fileData.fileHash}).then((response)=>{
                   
                    contents_old = response.data.filecontents;
                });
            }
            else if(oldfileExt==="application/pdf"){
               
                await Axios.post("http://localhost:3001/dlPDFFile",{fileURL:fileData.fileHash}).then((response)=>{
                   
                    contents_old = response.data.filecontents;
                });
           
            }
            
            contents_old=contents_old.toLowerCase();
            contents_new=contents_new.toLowerCase();
            //contents_old=contents_old.replace(/(\r\n|\n|\r)/gm, "");
            //contents_new=contents_new.replace(/(\r\n|\n|\r)/gm, "");
            contents_old=contents_old.replace(/[\n\r\t]/g, "");
            contents_new=contents_new.replace(/[\n\r\t]/g, "");
            //contents_old=contents_old.replace(/\s+/g, ' ').trim();
            //contents_new=contents_new.replace(/\s+/g, ' ').trim();
            contents_old=contents_old.split(' ').join('');
            contents_new=contents_new.split(' ').join('');
            
            
            console.log("processed content old: "+contents_old);
            console.log("processed content new: "+contents_new);
            const EditDistance=require("../../EditDistance")
            var EditNum=EditDistance.levenshtein(contents_old,contents_new);
            const changesNum=EditNum;
            console.log("Num of individual changes: "+changesNum);
            var contents_old_len=contents_old.length;
            var contents_new_len=contents_new.length;
            console.log("old content len: "+contents_old_len+"\nnew content len: "+contents_new_len);
            //var largestfile_len=Math.max(contents_old_len,contents_new_len);
            var largestfile_len=contents_old_len;
            console.log("Largest file len: "+largestfile_len);
            EditNum=EditNum/largestfile_len*100;
            console.log("EditDistance or percentage of file changed is:"+EditNum );

            await contract.methods.updateFile(uploadResult.path, uploadResult.size, filetype, filename, props.fileIndex,changesNum, largestfile_len).send({ from: accounts[0] }).on('transactionHash', (hash) => {
                setBuffer(null);
                setfileType(null);
                setfileName(null);
             });
            setUpdateDisable(false);
            window.location.reload(false);
            
        } catch (err) {
            console.log(err)
            setUpdateDisable(false);
            closeModalFunc();
        }  
        
    }

    
    return (
        <div className="modal-background">
        <div className="modal-container">
            <button className="modal-close-button" onClick={()=> {props.closeModal(false)}}> X </button>
            <div className="modal-title">
                <h1>Update File</h1>
                <h2>File id {props.fileIndex}</h2>
            </div>
            <form  className="modal-form" onSubmit={updateFile}>
                
                <div className="form-input">
                    {selectDisable && <input
                type="file"
                accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document, .txt, application/pdf"
                onChange={captureFile}
                />}
                {fullfilename}
                </div>
                
                <button  disabled={updateDisable} className="register-button">Upload File</button>
            </form>
        </div>
        
    </div>
    )
}

export default UpdateFileModal
