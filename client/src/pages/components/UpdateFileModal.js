import React, {useContext, useState, useEffect} from "react";
import BlockchainContext from "../../BlockchainContext";
import { IoAddCircle, IoRemoveCircleSharp } from "react-icons/io5";
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

    const [filePrivacy, setFilePrivacy] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [allowedUsers, setAllowedUsers] = useState([]);

    //button disable states
    const [updateDisable, setUpdateDisable] = useState(false);
    const [selectDisable, setSelectDisable] = useState(true);


    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    //get the file extension of the new updated file
    const [file_ext_new, setfileExtNew] = useState(null);

    useEffect(() => {

        const load = async () => {
            try {

                const allowUsers = await contract.methods.getAllowedUsers(props.fileIndex).call();
                const fileDataPrivacy = await contract.methods.files(props.fileIndex).call();
                setFilePrivacy(fileDataPrivacy.isPrivate);
                setAllowedUsers(allowUsers);
                

            } catch (err) {

                console.log(err)

            }

        }
        load()
        

        
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

             let contents_new = ""
             //tmp=0 for comapring files using utf=8 tmp=1 for comparing them based on binary/hex
             var tmp=0;
             if(tmp==0){
                if(file_ext_new==="txt"){
                    for await(const item of ipfs.cat(uploadResult.path)){
                        contents_new += new TextDecoder().decode(item)
                    }
                    contents_new=cleanString(contents_new);
                   
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
             }
             else{
                await Axios.post("http://localhost:3001/dlnonUTF",{fileURL:uploadResult.path,fileEXT:file_ext_new}).then((response)=>{
               
                    contents_new = response.data.filecontents;
                });
           
             }
            console.log('New File Content:'+contents_new);
    
            const fileData = await contract.methods.files(props.fileIndex).call();
            
            setFiledata(fileData);
            console.log('pulled fila data', fileData.fileHash, fileData.fileName);
            let contents_old = ""
            var oldfileExt=fileData.fileType;
            
            if(tmp==0){
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
            }
            else{
                
                if(oldfileExt==="application/pdf"){
                    var newfileext="pdf";
                }
                else if(oldfileExt==="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
                    var newfileext="docx";
                }
                else if(oldfileExt==="text/plain"){
                    var newfileext="txt";
                }
                //file_ext_new
                await Axios.post("http://localhost:3001/dlnonUTF",{fileURL:fileData.fileHash,fileEXT:newfileext}).then((response)=>{
                   
                    contents_old = response.data.filecontents;
                });
            }
            
            if(tmp==0){
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
            }
            console.log("processed content old: "+contents_old);
            console.log("processed content new: "+contents_new);
            const EditDistance=require("../../EditDistance")
            if(tmp==0){
                var EditNum=EditDistance.levenshtein(contents_old,contents_new);
                var changesNum=EditNum;
            }
            else{
                var EditNum=0;
                if(contents_old.length>contents_new.length ){
                     for(let i=0;i<contents_old.length;i++){
                         if(i>=contents_new.length){
                            EditNum=EditNum+EditDistance.levenshtein(String(contents_old[i].raw),"");
                         }
                         else{
                            EditNum=EditNum+EditDistance.levenshtein(String(contents_old[i].raw),String(contents_new[i].raw));
                         }
                         
                     }

                 }
                 else if(contents_old.length<contents_new.length){
                    for(let i=0;i<contents_new.length;i++){
                        if(i>=contents_old.length){
                           EditNum=EditNum+EditDistance.levenshtein("",String(contents_new[i].raw));
                        }
                        else{
                           EditNum=EditNum+EditDistance.levenshtein(String(contents_old[i].raw),String(contents_new[i].raw));
                        }
                        
                    }
                 }
                 else if(contents_old.length==contents_new.length){
                     for(let i=0;i<contents_old.length;i++){
                        
                           EditNum=EditNum+EditDistance.levenshtein(String(contents_old[i].raw),String(contents_new[i].raw));
                    }
                 }
                var changesNum=EditNum;
            }
            console.log("Num of individual changes: "+changesNum);
            var contents_old_len=contents_old.length;
            var contents_new_len=contents_new.length;
            console.log("old content len: "+contents_old_len+"\nnew content len: "+contents_new_len);
            //var largestfile_len=Math.max(contents_old_len,contents_new_len);
            if(tmp==0){
                var largestfile_len=contents_old_len;
            }
            else{
                var largestfile_len=0;
                for(let i=0;i<contents_old.length;i++){
                    largestfile_len=largestfile_len+contents_old[i].raw.length;
                }
            }
            
            console.log("Largest file len: "+largestfile_len);
            EditNum=EditNum/largestfile_len*100;
            console.log("EditDistance or percentage of file changed is:"+EditNum );

            await contract.methods.updateFile(uploadResult.path, uploadResult.size, filetype, filename, props.fileIndex,changesNum, largestfile_len, filePrivacy, allowedUsers).send({ from: accounts[0] }).on('transactionHash', (hash) => {
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

    const addAllowedUser = (e) => {
        e.preventDefault()
        if (selectedUser != '' || selectedUser != 'blank') {
            setAllowedUsers(allowedUsers => [...allowedUsers, selectedUser]);
            setSelectedUser('blank');

        }
                             

    }

    const removeAllowedUser = (e, user) => {
        e.preventDefault()
        const updatedAllowedUsers = allowedUsers.filter((id) => {
            return id != user;
          })
  
        setAllowedUsers(updatedAllowedUsers);
                             

    }

    const fileDataPrivacyInitializer = async () => {

        const fileDataPrivacy = await contract.methods.files(props.fileIndex).call();

        console.log('PRIVACY', fileDataPrivacy.isPrivate)
        return fileDataPrivacy.isPrivate;

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

                <p>File Privacy</p>
                    <input
                    type="checkbox"
                    defaultChecked={fileDataPrivacyInitializer()}
                    onChange={() => {
                      setFilePrivacy(!filePrivacy)
                    }}
                    />
                    { filePrivacy && 
                    <div className="private-details"> 
                        <p>Shared User Address</p>
                        <input 
                        type="text" 
                        required 
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="auth-input"
                        placeholder="Enter User Address"
                        />  
                         <button className="update-button" onClick={(e)=> {
                             addAllowedUser(e);
                             
                         }}><IoAddCircle size="30px" /></button>
                        
                    </div>}
                    {filePrivacy && allowedUsers.map((user, key) => {
                        return (<div>
                            <div className="allowed-users">
                            <p>{user}</p>
                            <button className="update-button" onClick={(e)=> {
                             removeAllowedUser(e, user);
                             
                         }}><IoRemoveCircleSharp size="30px" /></button>
                            </div>
                            
                        </div>)
                    }) }
                
                <button  disabled={updateDisable} className="register-button">Upload File</button>
            </form>
        </div>
        
    </div>
    )
}

export default UpdateFileModal
