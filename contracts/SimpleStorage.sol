// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    // data
    string public name = "ArchStorage";
    uint256 storedData;

    uint256 public fileIDs = 0;
    uint256 public fileNum = 0;
    uint256 public transactionCount = 0;
    mapping(uint256 => File) public files;
    mapping(address => UserDetail) user;

    struct File {
        uint256 fileId;
        string fileHash;
        uint256 fileSize;
        string fileType;
        string fileName;
        string fileDescription;
        uint256 uploadTime;
        address uploader;
    }

    struct UserDetail {
        address addr;
        string name;
        string password;
        bool isUserLoggedIn;
    }

    struct Transaction {
        address userAddress;
        string userName;
        string fileName;
        string fileHash;
        uint256 fileSize;
        string transactionType;
        uint256 changeLevel;
        uint256 uploadTime;
    }
    Transaction[] transactions;

    //events

    // event transactionAdded(Transaction temp);

    event FileUploaded(
        uint256 fileId,
        string fileHash,
        uint256 fileSize,
        string fileType,
        string fileName,
        string fileDescription,
        uint256 uploadTime,
        address uploader
    );

    event FileUpdated(
        string fileHash,
        uint256 fileSize,
        string fileType,
        uint256 uploadTime,
        address uploader
    );

    constructor() public {}

    function uploadFile(
        string memory _fileHash,
        uint256 _fileSize,
        string memory _fileType,
        string memory _fileName,
        string memory _fileDescription
    ) public {
        // Make sure the file hash exists
        require(bytes(_fileHash).length > 0);
        // Make sure file type exists
        require(bytes(_fileType).length > 0);
        // Make sure file description exists
        require(bytes(_fileDescription).length > 0);
        // Make sure file fileName exists
        require(bytes(_fileName).length > 0);
        // Make sure uploader address exists
        require(msg.sender != address(0));
        // Make sure file size is more than 0
        require(_fileSize > 0);

        // Increment file id
        fileIDs++;
        fileNum++;

        // Add File to the contract
        files[fileIDs] = File(
            fileIDs,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            block.timestamp,
            msg.sender
        );

        Transaction memory temp;
        temp.userAddress = msg.sender;
        temp.userName = user[msg.sender].name;
        temp.fileName = _fileName;
        temp.fileHash = _fileHash;
        temp.fileSize = _fileSize;
        temp.transactionType = "ADD";
        temp.changeLevel = 0;
        temp.uploadTime = block.timestamp;
        transactions.push(temp);

        transactionCount++;
        // Trigger an event
        emit FileUploaded(
            fileIDs,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            block.timestamp,
            msg.sender
        );
    }

    function updateFile(
        string memory _fileHash,
        uint256 _fileSize,
        string memory _fileType,
        uint256 _fileID,
        uint256 _changeValue
    ) public {
        // Make sure the file hash exists
        require(bytes(_fileHash).length > 0);
        // Make sure file type exists
        require(bytes(_fileType).length > 0);
        // Make sure uploader address exists
        require(msg.sender != address(0));
        // Make sure file size is more than 0
        require(_fileSize > 0);
        require(_fileID > 0 && _fileID <= fileIDs);
        require(_changeValue >= 0);

        // update current file
        files[_fileID].fileHash = _fileHash;
        files[_fileID].fileSize = _fileSize;
        files[_fileID].fileType = _fileType;
        files[_fileID].uploadTime = block.timestamp;
        files[_fileID].uploader = msg.sender;

        Transaction memory temp;
        temp.userAddress = msg.sender;
        temp.userName = user[msg.sender].name;
        temp.fileName = files[_fileID].fileName;
        temp.fileHash = _fileHash;
        temp.fileSize = _fileSize;
        temp.transactionType = "UPDATE";
        temp.changeLevel = _changeValue;
        temp.uploadTime = block.timestamp;
        transactions.push(temp);

        transactionCount++;
        // Trigger an event
        emit FileUpdated(
            _fileHash,
            _fileSize,
            _fileType,
            block.timestamp,
            msg.sender
        );
    }

    function getFile(uint256 _fileID) public view returns (File memory) {
        return files[_fileID];
    }

    function deleteFile(uint256[] memory _fileID) public {
        require(_fileID.length > 0);
        for (uint256 i = 0; i < _fileID.length; i++) {
            Transaction memory temp;
            temp.userAddress = msg.sender;
            temp.userName = user[msg.sender].name;
            temp.fileName = files[_fileID[i]].fileName;
            temp.fileHash = files[_fileID[i]].fileHash;
            temp.fileSize = files[_fileID[i]].fileSize;
            temp.transactionType = "DELETE";
            temp.changeLevel = 0;
            temp.uploadTime = block.timestamp;
            transactions.push(temp);

            transactionCount++;
            delete files[_fileID[i]];
            fileNum -= 1;
        }
    }

    // user registration function
    function register(
        address _address,
        string memory _name,
        string memory _password
    ) public returns (bool) {
        require(user[_address].addr != msg.sender);
        user[_address].addr = _address;
        user[_address].name = _name;
        user[_address].password = _password;
        user[_address].isUserLoggedIn = false;
        return true;
    }

    // user login function
    function login(address _address, string memory _password)
        public
        returns (bool)
    {
        if (
            keccak256(abi.encodePacked(user[_address].password)) ==
            keccak256(abi.encodePacked(_password))
        ) {
            user[_address].isUserLoggedIn = true;
            return user[_address].isUserLoggedIn;
        } else {
            return false;
        }
    }

    // check the user logged In or not
    function checkIsUserLogged(address _address) public view returns (bool) {
        return (user[_address].isUserLoggedIn);
    }

    function checkUserName(address _address)
        public
        view
        returns (string memory)
    {
        return (user[_address].name);
    }

    // logout the user
    function logout(address _address) public {
        user[_address].isUserLoggedIn = false;
    }

    // function addTransaction(
    //     address _userAddress,
    //     string memory _userName,
    //     string memory _fileName,
    //     string memory _fileHash,
    //     string memory _transactionType,
    //     uint256 _changeLevel
    // ) public {
    //     Transaction memory temp;
    //     temp.userAddress = _userAddress;
    //     temp.userName = _userName;
    //     temp.fileName = _fileName;
    //     temp.fileHash = _fileHash;
    //     temp.transactionType = _transactionType;
    //     temp.changeLevel = _changeLevel;
    //     transactions.push(temp);

    //     transactionCount++;
    //     emit transactionAdded(temp);

    // }

    function getAllTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
