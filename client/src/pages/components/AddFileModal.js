import React, {useContext, useState, useEffect} from "react";
import BlockchainContext from "../../BlockchainContext";
import { IoAddCircle, IoRemoveCircleSharp } from "react-icons/io5";

const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 
const ipfs = ipfsClient.create('https://ipfs.infura.io:5001/api/v0') 

function AddFileModal( {closeModal}) {
    
    const [description, setDescription] = useState('');
    const [filetype, setfileType] = useState(null);
    const [filename, setfileName] = useState(null);
    
    const [fullfilename, setFullfilename] = useState(null)
    const [buffer, setBuffer] = useState(null);
    const [filePrivacy, setFilePrivacy] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [allowedUsers, setAllowedUsers] = useState([]);

    //button disable states
    const [uploadDisable, setUploadDisable] = useState(false);
    const [selectDisable, setSelectDisable] = useState(true);


    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;

    useEffect(() => {
        console.log('FILE DATA:', filename, filetype);
        console.log('buffer: ', buffer);
    }, [filetype,filename, buffer]);

    const closeModalFunc = () =>{
        closeModal(false);
    }
    const uploadFile = async (e) => {
        
        e.preventDefault();
        setUploadDisable(true);
        
        try {
            const uploadResult = await ipfs.add(Buffer.from(buffer));
            console.log(uploadResult);
            console.log('ipfs data', uploadResult.path, uploadResult.size);
            
            // if(filetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            //     setfileType('.docx');
            // }

            const userName = await contract.methods.checkUserName(accounts[0]).call();
            
            
            console.log('TEST FILETYPE:',filetype)
            // setAllowedUsers(allowedUsers => [...allowedUsers, accounts[0]]);
            await contract.methods.uploadFile(uploadResult.path, uploadResult.size, filetype, filename, description, filePrivacy, allowedUsers).send({ from: accounts[0] }).on('transactionHash', (hash) => {
               setBuffer(null);
               setfileType(null);
               setfileName(null);
            });
            setUploadDisable(false);
            window.location.reload(false);
            // closeModalFunc();
            
        } catch (err) {
            console.log(err)
            setUploadDisable(false);
            closeModalFunc();
        }
        
    }

    const addAllowedUser = (e) => {
        e.preventDefault()
        if (selectedUser != '') {
            setAllowedUsers(allowedUsers => [...allowedUsers, selectedUser]);
            setSelectedUser('');

        }
                             

    }

    const removeAllowedUser = (e, user) => {
        e.preventDefault()
        const updatedAllowedUsers = allowedUsers.filter((id) => {
            return id != user;
          })
  
        setAllowedUsers(updatedAllowedUsers);
                             

    }

    

    const captureFile = event => {
        event.preventDefault()
    
        const file = event.target.files[0]
        console.log(file)
        const reader = new window.FileReader()
        
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            setBuffer(Buffer(reader.result));
            setfileType(file.type);
            const fileNameFilter = file.name.split(".")
            setFullfilename(file.name)
            setfileName(fileNameFilter[0]);
            setSelectDisable(false);

        }
      }
    return (
        <div className="modal-background">
            <div className="modal-container">
                <button className="modal-close-button" onClick={()=> {closeModal(false)}}> X </button>
                <div className="modal-title">
                    <h1>Upload File</h1>

                </div>
                <form  className="modal-form" onSubmit={uploadFile}>
                    <div className="form-input" >
                    <label>File Description</label>
                    <input 
                    type="text" 
                    required 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="auth-input"
                    placeholder="Enter Description"
                    />  
                    </div>
                    <div className="form-input">
                    { selectDisable && <input
                    type="file"
                    accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document, .txt, application/pdf"
                    onChange={captureFile}
                    />}
                    {fullfilename}
                    </div>
                    <p>File Privacy</p>
                    <input
                    type="checkbox"
                    defaultChecked={filePrivacy}
                    onChange={() => {
                      setFilePrivacy(!filePrivacy)
                    }}
                    />
                    { filePrivacy && 
                    <div className="private-details"> 
                        <p>Shared User Address</p>
                        <input 
                        type="text" 
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
                    
                    
                    <button  disabled={uploadDisable} className="register-button">Upload File</button>
                </form>
            </div>
            
        </div>
    )
}

export default AddFileModal
