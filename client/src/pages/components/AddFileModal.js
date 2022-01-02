import React, {useContext, useState, useEffect} from "react";
import BlockchainContext from "../../BlockchainContext";

const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 
const ipfs = ipfsClient.create('https://ipfs.infura.io:5001/api/v0') 

function AddFileModal( {closeModal}) {
    
    const [description, setDescription] = useState('');
    // const [uploadfile, setUploadfile] = useState([])
    const [filetype, setfileType] = useState(null);
    const [filename, setfileName] = useState(null);
    const [buffer, setBuffer] = useState(null);
    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    // console.log('context provider data ',web3, contract, accounts[0]);

    useEffect(() => {
        console.log('FILE DATA:', filename, filetype);
        console.log('buffer: ', buffer);
    }, [filetype,filename, buffer]);

    const closeModalFunc = () =>{
        closeModal(false);
    }
    const uploadFile = async (e) => {
        
        e.preventDefault();
        // alert(`FILE DATA ${filename} ${filetype} ${buffer}`);
        try {
            const uploadResult = await ipfs.add(Buffer.from(buffer));
            console.log(uploadResult);
            console.log('ipfs data', uploadResult.path, uploadResult.size);

            if(filetype === ''){
                setfileType('none');
            }
            await contract.methods.uploadFile(uploadResult.path, uploadResult.size, filetype, filename, description).send({ from: accounts[0] }).on('transactionHash', (hash) => {
               setBuffer(null);
               setfileType(null);
               setfileName(null);
            });
            window.location.reload(false);
            // closeModalFunc();
            

            // alert(`HASH DATA ${uploadResult[0].hash}`);
        } catch (err) {
            console.log(err)
        }
        // ipfs.add(buffer, (error, result) => {
        //     console.log('IPFS result', result.size)
        //     if(error) {
        //       console.error(error)
        //       return
        //     }
        //     // console.log('POTATO');
        //     
        //     // alert(`FILE DATA ${filename} ${filetype} ${buffer}`);
            
        //     // this.setState({ loading: true })
        //     // // Assign value for the file without extension
        //     // if(this.state.type === ''){
        //     //   this.setState({type: 'none'})
        //     // }
        //     // this.state.dstorage.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        //     //   this.setState({
        //     //    loading: false,
        //     //    type: null,
        //     //    name: null
        //     //  })
        //     //  window.location.reload()
        //     // }).on('error', (e) =>{
        //     //   window.alert('Error')
        //     //   this.setState({loading: false})
        //     // })
        //   })

        
        
        
    }

    const captureFile = event => {
        event.preventDefault()
    
        const file = event.target.files[0]
        console.log(file)
        const reader = new window.FileReader()
        // // setBuffer([...buffer, Buffer(reader.result)]);
        // setfileType(event.target.files[0].type);
        // setfileName(event.target.files[0].name);
        //   console.log('FILE DATA:', filename, filetype);
        //   console.log('buffer: ', buffer);
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            setBuffer(Buffer(reader.result));
            setfileType(file.type);
            setfileName(file.name);
            // console.log('FILE DATA:', filename, filetype);
            // console.log('buffer: ', buffer);
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
                    <input
                    type="file"
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

export default AddFileModal
