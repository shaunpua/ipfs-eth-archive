import React,  {useState, useEffect, useContext} from "react";
import {useNavigate } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";
import NavBar2 from "./components/Navbar2"
import Sidebar from "./components/Sidebar";
import AddFileModal from "./components/AddFileModal";
import UpdateFileModal from "./components/UpdateFileModal";
import { convertBytes } from '../extraFunctions';
import moment from 'moment'


function HomePage() {
    const [filecount, setFilecount] = useState(null);
    const [fileNum, setFileNum] = useState(null);
    const [files, setFiles] = useState([]);
    const [checked, setChecked] = useState([]);
    const [deletedID, setDeletedID] = useState([]);
    const [userdata, setUserdata] = useState(null);
    const [fileID, setFileID] = useState(null);
    const [openmodal, setOpenmodal] = useState(false);
    const [updatemodal, setUpdatemodal] = useState(false);
    const [displayDelete, setDisplayDelete] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    // const [contractname, setContractname] = useState('');


    const navigate = useNavigate();

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    // console.log('context provider data ',web3, contract, accounts[0]);
    
    useEffect(()=>{
        const load = async () => {
          
          try {
                const checkLogin = await contract.methods.checkIsUserLogged(accounts[0]).call();
                console.log(checkLogin, 'LOGIN STATE 1 /home')

                // await contract.methods.name().call(function(err,res){
                //   setContractname(res);
                  
                // });
      
                await contract.methods.fileIDs().call(function(err,res){
                  setFilecount(res);
                  
                });

                await contract.methods.fileNum().call(function(err,res){
                  setFileNum(res);
                  
                });
                const userName = await contract.methods.checkUserName(accounts[0]).call();
                setUserdata(userName);
                // await contract.methods.user(accounts[0]).call(function(err,res){
                //   console.log(res)
                //   setUserdata(res);
                // });
                
                console.log(loggedIn, 'login state 2')
                 if (checkLogin === true){
                   setLoggedIn(true);
                 } else {
                   navigate('/auth');
                 }
            } catch (err){
                console.log(err)
                
            }

        setFiles([]);
        await loadFiles(); 
    
        }
        if (typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof contract !== 'undefined') {
          load()
        }
      }, [web3, accounts, contract, filecount, fileID])


    const loadFiles = async () => {
      
      for (var i = filecount; i >= 1; i--) {
        const file = await contract.methods.files(i).call();
        
        if (file.fileId > 0){
          setFiles(files =>[...files, file]);
          setChecked(checked =>[...checked, false]);
        }

        // setFiles(files =>[...files, file]);
        
        
        
      }

    }

    const handleOnChange = (position) => {
      const updatedCheckedState = checked.map((item, index) =>
        index === position ? !item : item
      );

      setChecked(updatedCheckedState);
      if (checked[position] === false) {
        setDeletedID(deletedID =>[...deletedID, position+1]);
      } else {
        const updatedDeletedIDs = deletedID.filter((id) => {
          return id != position+1;
        })

        setDeletedID(updatedDeletedIDs);
      }
      
    };

    const ifDeletedSelected = (checked) =>{
      
      for (let i = 0; i < checked.length; i++ ){
        if (checked[i] === true) {
          return true
        }
      }
      return false
    }

    const deleteFiles = async (deletedID) => {

      console.log(deletedID);

      try {
        await contract.methods.deleteFile(deletedID).send({ from: accounts[0] });
        window.location.reload(false);

      } catch (err) {
        console.log(err)
      }  
    }

    return (
        <div className="HomePage">
          <NavBar2/>
          {openmodal && <AddFileModal closeModal={setOpenmodal}/>}
          {updatemodal && <UpdateFileModal  fileIndex={fileID} closeModal={setUpdatemodal} />}
          <div className="home-container">
            <Sidebar/>
            <div className="home-content">
            
              <h2>ArchStorage / All Files</h2>
              <h3>File count: {fileNum}</h3>
              <h3>Total added files are: {filecount}</h3>
              <h3>user name  is: {userdata}</h3>
              {/* <h3>File count is: {files[1].fileSize}</h3> */}
              <button className="upload-button" onClick={()=> {setOpenmodal(true)}}>Create +</button>
              <div className="home-file-descriptions">
                  <p>ID</p>
                  <p>Name</p>
                  <p>Description</p>
                  <p>Type</p>
                  <p>Size</p>
                  <p>Date</p>
                  <p>Uploader</p>
                  <p>Hash</p>
              </div>
              
              <div className="home-files-container">
                {files.map((file, key) => {
                  return (<div className="file-section">
                     <input
                    type="checkbox"
                    
                    
                    checked={checked[file.fileId-1]}
                    onChange={() => {
                      handleOnChange(file.fileId-1)
                    }}
                  />
                  <p>{file.fileId}</p>
                  <p>{file.fileName}</p>
                  <p>{file.fileDescription}</p>
                  <p>{file.fileType}</p>
                  <p>{convertBytes(file.fileSize)}</p>
                  <p>{moment.unix(file.uploadTime).format('h:mm:ss A M/D/Y')}</p>
                  <p><a
                            href={"https://etherscan.io/address/" + file.uploader}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.uploader.substring(0,10)}...
                          </a></p>
                  <p><a
                            href={"https://ipfs.infura.io/ipfs/" + file.fileHash}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.fileHash.substring(0,10)}...
                          </a></p>
                  <button onClick={()=> {
                    setUpdatemodal(true)
                    setFileID(file.fileId)
                    }}>Update</button>
                  
                </div>)
                })}
                
                
              </div>
             {ifDeletedSelected(checked) && <button className="upload-button" onClick={()=> {setDisplayDelete(true)}}>Delete</button>}
             {displayDelete && <div className="modal-background">
                <div className="modal-container">
                <button className="modal-close-button" onClick={()=> {setDisplayDelete(false)}}> X </button>
                <div className="modal-title">
                    <h1>Delete Selected Files</h1>
                    <h2>Are you sure?</h2>
                </div>
                
                <button className="register-button" onClick={()=> {deleteFiles(deletedID)}}>Delete</button>
                <button className="register-button" onClick={()=> {setDisplayDelete(false)}}>Cancel</button>
                </div>
             </div>}
             
              
             
            </div>
          </div>
           
         
        </div>
    )
}

export default HomePage