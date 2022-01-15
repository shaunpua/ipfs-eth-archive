import React, {useContext, useState, useEffect} from "react";
import BlockchainContext from "../../BlockchainContext";

const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 
const ipfs = ipfsClient.create('https://ipfs.infura.io:5001/api/v0') 

function UpdateFileModal(props) {
    const [filedata, setFiledata] = useState(null);
    const [filetype, setfileType] = useState(null);
    const [filename, setfileName] = useState(null);
    const [buffer, setBuffer] = useState(null);
    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    const [file_ext_new, setfileExtNew] = useState(null);

    useEffect(() => {
        console.log('FILE DATA:', filename, filetype);
        console.log('buffer: ', buffer);
        console.log('newfile ext:',file_ext_new);
    }, [filetype,filename, buffer,file_ext_new]);

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
            setfileName(file.name);
            var fileExtVal=file.name.split(".");
            setfileExtNew(fileExtVal[1]);
        }
      }

      const updateFile = async (e) => {
        
        e.preventDefault();
       
        try {
            
            const uploadResult = await ipfs.add(Buffer.from(buffer));
            console.log(uploadResult);
            console.log('ipfs data', uploadResult.path, uploadResult.size);

            if(filetype === ''){
                setfileType('none');
            }
            //console log the file content of the new updated file
            let contents_new = ""
            // loop over incoming data
            if(file_ext_new==="txt"){
                for await(const item of ipfs.cat(uploadResult.path)){
                    // turn string buffer to string and append to contents
                    contents_new += new TextDecoder().decode(item)
                }
                console.log('New File Content:'+contents_new);
            }
            // else if(file_ext_new==="docx"){
            //     for await(const item of ipfs.cat(uploadResult.path)){
            //         // turn string buffer to string and append to contents
            //         contents += new TextDecoder().decode(item)
            //     }
            //     console.log('New File Content pre conversion:'+contents);
            //     //let docxcontents = await getWordBodyText("file-sample_100kB.docx");
            //     console.log("New File Content post conversion:"+docxcontents);
            // }
            const fileData = await contract.methods.files(props.fileIndex).call();
        
            setFiledata(fileData);
            console.log('pulled file data', fileData.fileHash, fileData.fileId);
            let contents_old = ""
              // loop over incoming data
              for await(const item of ipfs.cat(fileData.fileHash)){
                  // turn string buffer to string and append to contents
                  contents_old += new TextDecoder().decode(item)
              }
            contents_old=contents_old.toLowerCase();
            contents_new=contents_new.toLowerCase();
            contents_old=contents_old.replace(/(\r\n|\n|\r)/gm, "");
            contents_new=contents_new.replace(/(\r\n|\n|\r)/gm, "");
            contents_old=contents_old.split(' ').join('');
            contents_new=contents_new.split(' ').join('');
            console.log("processed content old: "+contents_old);
            console.log("processed content new: "+contents_new);
            const EditDistance=require("../../EditDistance")
            const EditNum=EditDistance.levenshtein(contents_old,contents_new);
            console.log("EditDistance is:"+EditNum );
            await contract.methods.updateFile(uploadResult.path, uploadResult.size, filetype, props.fileIndex, EditNum).send({ from: accounts[0] }).on('transactionHash', (hash) => {
                setBuffer(null);
                setfileType(null);
                setfileName(null);
             });
            
            //window.location.reload(false);
            
        } catch (err) {
            console.log(err)
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
                <input
                type="file" 
                //accept=".docx,.txt"
                accept=".txt"
                // value={uploadfile}
                onChange={captureFile}
                // onChange={(e) => setUploadfile(e.target.files[0])}
                />
                </div>
                
                <button className="register-button">Upload File</button>
            </form>
        </div>
        
    </div>
    )
}

export default UpdateFileModal
