import React,  {useState, useEffect, useContext} from "react";
import {useNavigate, useParams } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";
import UpdateFileModal from "./components/UpdateFileModal";
import NavBar2 from "./components/Navbar2"
import Sidebar from "./components/Sidebar";
import moment from 'moment'
import { convertBytes } from '../extraFunctions';

function FileSPage() {

    let  {fileid} = useParams();

    const [file, setFile] = useState(null);
    const [fileHash, setFileHash] = useState(null);
    const [fileSize, setFileSize] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [fileDescription, setFileDescription] = useState(null);
    const [fileUploader, setFileUploader] = useState(null);
    const [fileUsername, setFileUsername] = useState(null);
    const [fileUploadTime, setFileUploadTime] = useState(null);
    const [fileLastChange, setFileLastChange] = useState(null);
    const [fileLastSize, setFileLastSize] = useState(null);
    const [fileAllowedUsers, setFileAllowedUsers] = useState([]);
    const [filePrivacy, setFilePrivacy] = useState(false);


    const [selectedUser, setSelectedUser] = useState('');
    const [allowedUsers, setAllowedUsers] = useState([]);

    const [updatemodal, setUpdatemodal] = useState(false);
    const [displayDelete, setDisplayDelete] = useState(false);
    const [deletedFileID, setDeletedFileID] = useState(null);
    const [deleteDisable, setDeleteDisable] = useState(false);
    
    const [userdata, setUserdata] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const navigate = useNavigate();

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;

    

    useEffect(()=>{
        const load = async () => {
          
          try {
                const checkLogin = await contract.methods.checkIsUserLogged(accounts[0]).call();
                

                const userName = await contract.methods.checkUserName(accounts[0]).call();
                setUserdata(userName);
                const fileData = await contract.methods.files(fileid).call();

                setFile(fileData);
                setFileHash(fileData.fileHash)
                setFileSize(fileData.fileSize)
                setFileType(fileData.fileType)
                setFileName(fileData.fileName)
                setFileDescription(fileData.fileDescription)
                setFileUploader(fileData.uploader)
                setFileUploadTime(fileData.uploadTime)
                setFileLastChange(fileData.lastChange)
                setFileLastSize(fileData.lastSize)

                setFilePrivacy(fileData.isPrivate)

                const fileUser = await contract.methods.checkUserName(fileData.uploader).call();
                setFileUsername(fileUser);

                const allowUsers = await contract.methods.getAllowedUsers(fileid).call();
                
                setFileAllowedUsers(allowUsers);

                 if (checkLogin === true){
                   setLoggedIn(true);
                 } else {
                   navigate('/auth');
                 }
            } catch (err){
                console.log(err)
                
            }

        // setFiles([]);
        // await loadFiles(); 
    
        }
        if (typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof contract !== 'undefined') {
          load()
        }
      }, [web3, accounts, contract])


      const editPercent = (changes,total) => {
        if  (changes > 0 && total == 0)
          return 100;
        if(changes==0||total==0)
          return 0;
        else
          return changes/total*100;
       
      }

      const deleteFiles = async (deletedID) => {

        console.log("deleted ID", deletedID);
        setDeleteDisable(true);
        try {
          await contract.methods.deleteFile(deletedID).send({ from: accounts[0] });
          setDeleteDisable(false);
          navigate('/');    
  
        } catch (err) {
          setDeleteDisable(false);
          setDisplayDelete(false);
          console.log(err)
        }  
      }

      const buttonDisabler =   (privacy, fileID, curuser, uploader, curaddress) => {
        if (privacy === false || curaddress == uploader) {
          return false;
        } else {
          
        //   const foundAllowedUsers = fileAllowedUsers.filter((user) =>  {
        //     return user.ID === fileID  && user.users.includes(curuser)
        //   });
          
        //   console.log('found user array', foundAllowedUsers[0])
        //   if (foundAllowedUsers[0]) {
        //     return false
        //   }

            if (fileAllowedUsers.includes(curuser) === true) {
                return false;
            }
          
        
  
          return true;
           
            
        }
      }


  return (
    <div className="HomePage">
        <NavBar2/>
        {updatemodal && <UpdateFileModal  fileIndex={fileid} closeModal={setUpdatemodal} />}
        <div className="home-container">
            <Sidebar/>
            <div className="home-content">
            <h2>ArchStorage / File ID:  {fileid} </h2>

                <div className="filepage-content">
                    <h3>File Data</h3>
                    <p>File Name:  {fileName}</p>
                    <p>File Description:  {fileDescription}</p>
                    <p>File Type:  {fileType}</p>
                    {/* <p>File Hash:  {fileHash}</p> */}
                    <div>File Hash: <a
                             href={"https://ipfs.infura.io/ipfs/" + fileHash}
                            rel="noopener noreferrer"
                            target="_blank">{fileHash}
                            
                          </a></div>
                    <p>File Size: {convertBytes(fileSize)}</p>

                    
                    <div>File Uploader Address: <a
                            href={"https://etherscan.io/address/" + fileUploader}
                            rel="noopener noreferrer"
                            target="_blank">{fileUploader}
                            
                          </a></div>
                    <p>File Uploader Name:  {fileUsername}</p>
                    <p>File Upload Date: {moment.unix(fileUploadTime).format('h:mm:ss A M/D/Y')}</p>
                    

                    {editPercent(fileLastChange,fileLastSize)==0 ? <div classname="filepage-change"> <p>File Change: No Recent Changes</p> <div  className="file-section-lvdot" style={{ marginLeft: "0px"}}></div></div>: null }  
                  {editPercent(fileLastChange,fileLastSize) > 0 && editPercent(fileLastChange,fileLastSize) < 10 ? <div classname="filepage-change"> <p>File Change: Minor</p><div  className="file-section-lvdot" style={{backgroundColor: "green", marginLeft: "0px"}}></div></div>: null }
                  {editPercent(fileLastChange,fileLastSize) >= 10 && editPercent(fileLastChange,fileLastSize) < 50 ? <div classname="filepage-change"><p>File Change: Moderate</p> <div  className="file-section-lvdot" style={{backgroundColor: "#ffd105", marginLeft: "0px"}}></div></div>: null } 
                  {editPercent(fileLastChange,fileLastSize) >= 50 ? <div classname="filepage-change"><p>File Change: Major</p> <div  className="file-section-lvdot" style={{backgroundColor: "red", marginLeft: "0px"}}></div></div>: null } 

                </div>

                <button disabled={buttonDisabler(filePrivacy, fileid, userdata, fileUploader, accounts[0])} className="upload-button" onClick={()=> {setUpdatemodal(true)}}>Update File</button>
                <button  disabled={buttonDisabler(filePrivacy, fileid, userdata, fileUploader, accounts[0])} className="upload-button" onClick={()=> {setDisplayDelete(true)}}>Delete File</button>

                {displayDelete && <div className="modal-background">
                    <div className="modal-container">
                    <button className="modal-close-button" onClick={()=> {setDisplayDelete(false)}}> X </button>
                    <div className="modal-title">
                        <h1>Delete Selected File ID: {fileid}</h1>
                        <h2>Are you sure?</h2>
                    </div>
                    
                    <button disabled={deleteDisable} className="register-button" onClick={()=> {deleteFiles(fileid)}}>Delete</button>
                    <button className="register-button" onClick={()=> {setDisplayDelete(false)}}>Cancel</button>
                    </div>
                </div>}   
            
            </div>
        </div>

    </div>
  )
}

export default FileSPage