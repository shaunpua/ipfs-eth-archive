import React,  {useState, useEffect, useContext} from "react";
import {useNavigate, useParams } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";
import NavBar2 from "./components/Navbar2"
import Sidebar from "./components/Sidebar";
import moment from 'moment'
import { convertBytes } from '../extraFunctions';





function TransactionSPage() {

    let  {transactionid} = useParams();

    const [transactions, setTransactions] = useState([]);

    const [userdata, setUserdata] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const [userAddress, setUserAddress] = useState(null)
    const [userName, setUserName] = useState(null)

    const [fileID, setFileID] = useState(null)
    const [fileName, setFileName] = useState(null)
    const [fileHash, setFileHash] = useState(null)
    const [fileSize, setfileSize] = useState(null)

    const [transactionType, setTransactionType] = useState(null);
    const [uploadTime, setUploadTime] = useState(null);
    const [lastSize, setLastSize] = useState(null);
    const [changeLevel, setChangeLevel] = useState(null);
    
    
    const navigate = useNavigate();
    
    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;


    useEffect(()=>{


        
    
        const load = async () => {
          
          try {
                const checkLogin = await contract.methods.checkIsUserLogged(accounts[0]).call();
                
    
                
    
                const transactionArray = await contract.methods.getAllTransactions().call();
                
                transactionArray.reverse();
                setTransactionType(transactionArray[transactionid].transactionType);
                setUserAddress(transactionArray[transactionid].userAddress);
                setUserName(transactionArray[transactionid].userName);
                setFileID(transactionArray[transactionid].fileId);
                setFileName(transactionArray[transactionid].fileName);
                setFileHash(transactionArray[transactionid].fileHash);
                setfileSize(transactionArray[transactionid].fileSize);
                setUploadTime(transactionArray[transactionid].uploadTime);
                setLastSize(transactionArray[transactionid].lastSize);
                setChangeLevel(transactionArray[transactionid].changeLevel);
                setTransactions(transactionArray);
               
    
                 if (checkLogin === true){
                   setLoggedIn(true);
                 } else {
                   navigate('/auth');
                 }
            } catch (err){
                console.log(err)
                
            }
    
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

  return (
    <div className="HomePage">
        <NavBar2/>
        
        <div className="home-container">
            <Sidebar/>
            <div className="home-content">
            <h2>ArchStorage / Transaction:   </h2>

                <div className="filepage-content">
                    <h3>Transaction</h3>
                    <p>File ID: {fileID}</p>
                    <p>File Name: {fileName}</p>
                    {/* <p>File Hash: {fileHash}</p> */}
                    <div>File Hash: <a
                             href={"https://ipfs.infura.io/ipfs/" + fileHash}
                            rel="noopener noreferrer"
                            target="_blank">{fileHash}
                            
                          </a></div>
                    <p>File Size: {convertBytes(fileSize)}</p>
                    <p>Uploader Name: {userName}</p>
                    {/* <p>Uploader Address: {userAddress}</p> */}
                    <div>File Uploader Address: <a
                            href={"https://etherscan.io/address/" + userAddress}
                            rel="noopener noreferrer"
                            target="_blank">{userAddress}
                            
                          </a></div>

                    <p>Transaction Type: {transactionType}</p>
                    <p>Upload Time: {moment.unix(uploadTime).format('h:mm:ss A M/D/Y')}</p>
                    
                    

                    {editPercent(changeLevel,lastSize)==0 ? <div classname="filepage-change"> <p>File Change: No Recent Changes {changeLevel}/{lastSize}</p> <div  className="file-section-lvdot" style={{ marginLeft: "0px"}}></div></div>: null }  
                  {editPercent(changeLevel,lastSize) > 0 && editPercent(changeLevel,lastSize) < 10 ? <div classname="filepage-change"> <p>File Change: Minor {changeLevel}/{lastSize}</p><div  className="file-section-lvdot" style={{backgroundColor: "green", marginLeft: "0px"}}></div></div>: null }
                  {editPercent(changeLevel,lastSize) >= 10 && editPercent(changeLevel,lastSize) < 50 ? <div classname="filepage-change"><p>File Change: Moderate {changeLevel}/{lastSize}</p> <div  className="file-section-lvdot" style={{backgroundColor: "#ffd105", marginLeft: "0px"}}></div></div>: null } 
                  {editPercent(changeLevel,lastSize) >= 50 ? <div classname="filepage-change"><p>File Change: Major {changeLevel}/{lastSize}</p> <div  className="file-section-lvdot" style={{backgroundColor: "red", marginLeft: "0px"}}></div></div>: null } 

                </div>

               

              
            
            </div>
        </div>

    </div>
  )
}

export default TransactionSPage