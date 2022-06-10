// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    // data
    string public name = "ArchStorage";

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
        uint256 lastChange;
        uint256 lastSize;
        bool isPrivate;
        string[] allowedUsers;
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
        uint256 fileId;
        string fileName;
        string fileHash;
        uint256 fileSize;
        string transactionType;
        uint256 changeLevel;
        uint256 uploadTime;
        uint256 lastSize;
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
        address uploader,
        uint256 lastChange,
        uint256 lastSize,
        bool isPrivate,
        string[] allowedUsers
    );

    event FileUpdated(
        string fileHash,
        uint256 fileSize,
        string fileType,
        string fileName,
        uint256 uploadTime,
        address uploader,
        uint256 lastChange,
        uint256 lastSize,
        bool isPrivate,
        string[] allowedUsers
    );

    constructor() public {}

    function uploadFile(
        string memory _fileHash,
        uint256 _fileSize,
        string memory _fileType,
        string memory _fileName,
        string memory _fileDescription,
        bool filePrivacy,
        string[] memory allowedFileUsers
    ) public {
        // Make sure the file hash exists
        require(bytes(_fileHash).length > 0);
        // Make sure file type exists
        require(bytes(_fileType).length > 0);
        require(
            keccak256(abi.encodePacked(_fileType)) ==
                keccak256(abi.encodePacked("text/plain")) ||
                keccak256(abi.encodePacked(_fileType)) ==
                keccak256(
                    abi.encodePacked(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    )
                ) ||
                keccak256(abi.encodePacked(_fileType)) ==
                keccak256(abi.encodePacked("application/pdf"))
        );
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
            msg.sender,
            0,
            0,
            filePrivacy,
            allowedFileUsers
        );

        Transaction memory temp;
        temp.userAddress = msg.sender;
        temp.userName = user[msg.sender].name;
        temp.fileId = fileIDs;
        temp.fileName = _fileName;
        temp.fileHash = _fileHash;
        temp.fileSize = _fileSize;
        temp.transactionType = "ADD";
        temp.changeLevel = 0;
        temp.lastSize = 0;
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
            msg.sender,
            0,
            0,
            filePrivacy,
            allowedFileUsers
        );
    }

    function updateFile(
        string memory _fileHash,
        uint256 _fileSize,
        string memory _fileType,
        string memory _fileName,
        uint256 _fileID,
        uint256 _changeValue,
        uint256 _lastSize,
        bool filePrivacy,
        string[] memory allowedFileUsers,
        string memory _fileDescription
    ) public {
        // Make sure the file hash exists
        require(bytes(_fileHash).length > 0);
        // Make sure file type exists
        require(bytes(_fileType).length > 0);
        require(
            keccak256(abi.encodePacked(_fileType)) ==
                keccak256(abi.encodePacked("text/plain")) ||
                keccak256(abi.encodePacked(_fileType)) ==
                keccak256(
                    abi.encodePacked(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    )
                ) ||
                keccak256(abi.encodePacked(_fileType)) ==
                keccak256(abi.encodePacked("application/pdf"))
        );
        require(
            keccak256(abi.encodePacked(_fileType)) ==
                keccak256(abi.encodePacked(files[_fileID].fileType))
        );
        require(bytes(_fileName).length > 0);
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
        files[_fileID].fileName = _fileName;
        files[_fileID].uploadTime = block.timestamp;
        files[_fileID].lastChange = _changeValue;
        files[_fileID].lastSize = _lastSize;
        files[_fileID].isPrivate = filePrivacy;
        files[_fileID].allowedUsers = allowedFileUsers;
        files[_fileID].fileDescription = _fileDescription;

        Transaction memory temp;
        temp.userAddress = msg.sender;
        temp.userName = user[msg.sender].name;
        temp.fileId = _fileID;
        temp.fileName = files[_fileID].fileName;
        temp.fileHash = _fileHash;
        temp.fileSize = _fileSize;
        temp.transactionType = "UPDATE";
        temp.changeLevel = _changeValue;
        temp.uploadTime = block.timestamp;
        temp.lastSize = _lastSize;
        transactions.push(temp);

        transactionCount++;
        // Trigger an event
        emit FileUpdated(
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            block.timestamp,
            msg.sender,
            _changeValue,
            _lastSize,
            filePrivacy,
            allowedFileUsers
        );
    }

    function getFile(uint256 _fileID) public view returns (File memory) {
        return files[_fileID];
    }

    function deleteFile(uint256 _fileID) public {
        //require(_fileID.length > 0);
        // for (uint256 i = 0; i < _fileID.length; i++) {
        Transaction memory temp;
        temp.userAddress = msg.sender;
        temp.userName = user[msg.sender].name;
        temp.fileId = _fileID;
        temp.fileName = files[_fileID].fileName;
        temp.fileHash = files[_fileID].fileHash;
        temp.fileSize = files[_fileID].fileSize;
        temp.transactionType = "DELETE";
        temp.changeLevel = 0;
        temp.uploadTime = block.timestamp;
        transactions.push(temp);
        transactionCount++;
        delete files[_fileID];
        fileNum -= 1;

        // if (files[_fileID].isPrivate == false) {
        //     transactions.push(temp);

        //     transactionCount++;
        //     delete files[_fileID];
        //     fileNum -= 1;
        // } else if (files[_fileID].isPrivate == true) {
        //     if (files[_fileID].uploader == msg.sender) {
        //         transactions.push(temp);
        //         transactionCount++;
        //         delete files[_fileID];
        //         fileNum -= 1;
        //     } else {
        //         for (
        //             uint256 i = 0;
        //             i < files[_fileID].allowedUsers.length;
        //             i++
        //         ) {
        //             if (files[_fileID].allowedUsers[i] == msg.sender) {
        //                 transactions.push(temp);
        //                 transactionCount++;
        //                 delete files[_fileID];
        //                 fileNum -= 1;
        //             }
        //         }
        //     }
        // }

        // }
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

    function getAllTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    function getAllowedUsers(uint256 fileID)
        public
        view
        returns (string[] memory)
    {
        string[] memory gottenAllowedUsers;
        return gottenAllowedUsers = files[fileID].allowedUsers;
    }
}
