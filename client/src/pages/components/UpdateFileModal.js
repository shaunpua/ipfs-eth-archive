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

    //button disable states
    const [updateDisable, setUpdateDisable] = useState(false);
    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;

    useEffect(() => {
        console.log('FILE DATA:', filename, filetype);
        console.log('buffer: ', buffer);
    }, [filetype,filename, buffer]);


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
            setfileName(fileNameFilter[0]);
            
        }
      }
      

      const updateFile = async (e) => {
        
        e.preventDefault();
        setUpdateDisable(true);
        try {
            const uploadResult = await ipfs.add(Buffer.from(buffer));
            console.log(uploadResult);
            console.log('ipfs data', uploadResult.path, uploadResult.size);

            if(filetype === ''){
                setfileType('none');
            }

            const fileData = await contract.methods.files(props.fileIndex).call();
            
            setFiledata(fileData);
            console.log('pulled fila data', fileData.fileHash, fileData.fileName);
            

            // REPLACE 67 WITH LEVENSTEIN OUTPUT
            await contract.methods.updateFile(uploadResult.path, uploadResult.size, filetype, filename, props.fileIndex, 67).send({ from: accounts[0] }).on('transactionHash', (hash) => {
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
                <input
                type="file"
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .txt, application/pdf"
                onChange={captureFile}
                />
                </div>
                
                <button  disabled={updateDisable} className="register-button">Upload File</button>
            </form>
        </div>
        
    </div>
    )
}

export default UpdateFileModal
