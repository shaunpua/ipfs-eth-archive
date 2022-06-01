import React,  {useState, useEffect, useContext} from "react";
import {Link, useNavigate } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";
import NavBar2 from "./components/Navbar2"
import Sidebar from "./components/Sidebar";
import AddFileModal from "./components/AddFileModal";
import UpdateFileModal from "./components/UpdateFileModal";
import { convertBytes } from '../extraFunctions';
import moment from 'moment'
import { IoSync, IoTrash, IoFileTrayFull} from "react-icons/io5";


function HomePage() {
    const [filecount, setFilecount] = useState(null);
    const [fileNum, setFileNum] = useState(null);
    const [files, setFiles] = useState([]);
    const [checked, setChecked] = useState([]);
    // deletedID not used 
    const [deletedID, setDeletedID] = useState([]);
    const [userdata, setUserdata] = useState(null);
    const [fileID, setFileID] = useState(null);
    const [openmodal, setOpenmodal] = useState(false);
    const [updatemodal, setUpdatemodal] = useState(false);
    const [displayDelete, setDisplayDelete] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const [allowedUserMap, setAllowedUserMap] = useState([])

    const [deletedFileID, setDeletedFileID] = useState(null);
  // const [contractname, setContractname] = useState('');

    //button disabler states
    const [deleteDisable, setDeleteDisable] = useState(false);
    
    const navigate = useNavigate();

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    // console.log('context provider data ',web3, contract, accounts[0]);

    useEffect(()=>{
        const load = async () => {
          
          try {
                const checkLogin = await contract.methods.checkIsUserLogged(accounts[0]).call();
                console.log(checkLogin, 'LOGIN STATE 1 /home')

               

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
        const allowUsers = await contract.methods.getAllowedUsers(file.fileId).call();
        
        if (file.fileId > 0){
          setFiles(files =>[...files, file]);
          setAllowedUserMap(allowedUserMap => [...allowedUserMap, {ID: file.fileId, users: allowUsers}])
          setChecked(checked =>[...checked, false]);
        }
        // setFiles(files =>[...files, file]);    
      }

      console.log('FILE blockchain map', files)

    }

    const handleOnChange = (position, fileid) => {
      const updatedCheckedState = checked.map((item, index) =>
        index === position ? !item : item
      );

      setChecked(updatedCheckedState);
      if (checked[position] === false) {
        setDeletedID(deletedID =>[...deletedID, fileid]);
      } else {
        const updatedDeletedIDs = deletedID.filter((id) => {
          return id != fileid;
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
      setDeleteDisable(true);
      try {
        await contract.methods.deleteFile(deletedFileID).send({ from: accounts[0] });
        setDeleteDisable(false);
        window.location.reload(false);

      } catch (err) {
        setDeleteDisable(false);
        setDisplayDelete(false);
        console.log(err)
      }  
    }

    const editPercent = (changes,total) => {
      if  (changes > 0 && total == 0)
        return 100;
      if(changes==0||total==0)
        return 0;
      else
        return changes/total*100;
     
    }

    const returnUsername =  (address) => {
      // const userName = await contract.methods.checkUserName(address).call();

      const userName ="test user1"

      return userName;
    }

    const buttonDisabler =   (privacy, fileID, curuser, uploader, curaddress) => {
      if (privacy === false || curaddress == uploader) {
        return false;
      } else {
        
        const foundAllowedUsers = allowedUserMap.filter((user) =>  {
          return user.ID === fileID  && user.users.includes(curuser)
        });
        
        console.log('found user array', foundAllowedUsers[0])
        if (foundAllowedUsers[0]) {
          return false
        }
        // if (foundAllowedUsers.length > 0){
        //   for (let i = 0; foundAllowedUsers[0].users.length; i++){
        //     if (foundAllowedUsers[0].users[i] === curuser) {
        //       return false;
        //     }
        //   }

        // }
        

        
        // if (curuser === foundAllowedUsers[0].users) {
        //   return false;
        // }
        

      

        return true;
         
          
      }
    }

    

    // if (typeof contract === 'undefined') {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
        <div className="HomePage">
          <NavBar2/>
          {openmodal && <AddFileModal closeModal={setOpenmodal}/>}
          {updatemodal && <UpdateFileModal  fileIndex={fileID} closeModal={setUpdatemodal} />}
          <div className="home-container">
            <Sidebar/>
            <div className="home-content">
            
              <h2>ArchStorage / All Files</h2>
              <p>Welcome, {userdata}</p>
              <p>Current File Count: {fileNum}</p>
              <p>Total Added Files: {filecount}</p>
              
              <button className="upload-button" onClick={()=> {setOpenmodal(true)}}>Create +</button>
              <div className="home-file-descriptions">
                  <p style={{width: "20px", marginLeft: "25px"}}>ID</p>
                  <p style={{width: "110px", marginLeft: "5px"}}>Name</p>
                  <p style={{width: "110px", marginLeft: "25px"}}>Description</p>
                  <p style={{width: "60px", marginLeft: "105px"}}>Type</p>
                  <p style={{width: "40px", marginLeft: "35px"}}>Size</p>
                  <p style={{width: "110px", marginLeft: "30px"}}>Date</p>
                  <p style={{width: "110px", marginLeft: "50px"}}>Uploader</p>
                  <p style={{width: "110px", marginLeft: "10px"}}>Hash</p>
              </div>
              
              <div className="home-files-container">
                {files.map((file, key) => {
                  return (<div className="file-section" >
                    <button className="update-button" onClick={() => navigate(`/file/${file.fileId}`)}><IoFileTrayFull size="30px" /></button>
                    
                  {/* <input
                    type="checkbox"
                    checked={checked[key]}
                    onChange={() => {
                      handleOnChange(key, file.fileId)
                    }}
                  /> */}
                  {/* <p>user {consoleLogger(file)}</p> */}
                  <div className="file-section-item" style={{width: "20px", marginLeft: "10px" }} >{file.fileId}</div>
                  
                  
                  <div className="file-section-item" style={{width: "120px", marginLeft: "5px"}}>{file.fileName}</div>
                  <div className="file-section-item" style={{width: "200px", marginLeft: "15px"}}>{file.fileDescription}</div>
                  <div className="file-section-item" style={{width: "80px", marginLeft: "15px"}}>
                  
                  {file.fileType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? <p>docx</p>: file.fileType }
                  </div>
                  <div className="file-section-item" style={{width: "60px", marginLeft: "10px"}}>{convertBytes(file.fileSize)}</div>
                  <div className="file-section-item" style={{width: "150px", marginLeft: "10px"}}>{moment.unix(file.uploadTime).format('h:mm:ss A M/D/Y')}</div>
                  {/* <div className="file-section-item" style={{width: "120px", marginLeft: "5px"}}>{file.uploaderName}</div> */}
                  <div className="file-section-item" style={{width: "110px", marginLeft: "10px"}}><a
                            href={"https://etherscan.io/address/" + file.uploader}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.uploader.substring(0,10)}...
                          </a></div>
                  <div className="file-section-item" style={{width: "110px", marginLeft: "10px"}}><a
                            href={"https://ipfs.infura.io/ipfs/" + file.fileHash}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.fileHash.substring(0,10)}...
                          </a></div>
                  <button disabled={buttonDisabler(file.isPrivate, file.fileId, userdata, file.uploader, accounts[0])} className="update-button" onClick={()=> {
                    setUpdatemodal(true)
                    setFileID(file.fileId)
                    }}><IoSync  size="30px" /></button>
                    <button  disabled={buttonDisabler(file.isPrivate, file.fileId, userdata, file.uploader, accounts[0])} className="update-button" onClick={()=> {
                    // setDeletedID(deletedID =>[...deletedID, file.fileId]);
                    setDeletedFileID(file.fileId);
                    setDisplayDelete(true)
                    
                      
                    }}><IoTrash size="30px" /></button>
                  {editPercent(file.lastChange,file.lastSize)==0 ? <div  className="file-section-lvdot"></div>: null }  
                  {editPercent(file.lastChange,file.lastSize) > 0 && editPercent(file.lastChange,file.lastSize) < 10 ? <div  className="file-section-lvdot" style={{backgroundColor: "green"}}></div>: null }
                  {editPercent(file.lastChange,file.lastSize) >= 10 && editPercent(file.lastChange,file.lastSize) < 50 ? <div  className="file-section-lvdot" style={{backgroundColor: "#ffd105"}}></div>: null } 
                  {editPercent(file.lastChange,file.lastSize) >= 50 ? <div  className="file-section-lvdot" style={{backgroundColor: "red"}}></div>: null } 
                  {/* {file.lastChange == 0 ? <div  className="file-section-lvdot"></div>: null }
                  {file.lastChange > 0 ? <div  className="file-section-lvdot" style={{backgroundColor: "red"}}></div>: null } */}
                  
                </div>)
                })}
                
                
              </div>
             {ifDeletedSelected(checked) && <button className="upload-button" onClick={()=> {setDisplayDelete(true)}}>Delete</button>}
             {displayDelete && <div className="modal-background">
                <div className="modal-container">
                <button className="modal-close-button" onClick={()=> {setDisplayDelete(false)}}> X </button>
                <div className="modal-title">
                    <h1>Delete Selected File ID: {deletedFileID}</h1>
                    <h2>Are you sure?</h2>
                </div>
                
                <button disabled={deleteDisable} className="register-button" onClick={()=> {deleteFiles(deletedFileID)}}>Delete</button>
                <button className="register-button" onClick={()=> {setDisplayDelete(false)}}>Cancel</button>
                </div>
             </div>}   
            </div>
          </div> 
        </div>
    )
}

export default HomePage
