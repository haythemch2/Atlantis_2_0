// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract Atlantis is ERC721Base {
    using Strings for uint256;

    // Mapping from (x, y) to token ID
    mapping(uint256 => mapping(uint256 => uint256)) private _coordinatesToTokenId;

    string private constant NAME = "Atlantis Plots";
    string private constant SYMBOL = "ATLNTS";
    uint128 private constant ROYALTY_BPS = 1000; // 10%

    constructor(address _defaultAdmin)
        ERC721Base(_defaultAdmin, NAME, SYMBOL, _defaultAdmin, ROYALTY_BPS)
    {}

    function mintPlot(uint256 x, uint256 y, string memory fullURI) public {
        require(!doesPlotExist(x, y), "Plot already minted");
    
        uint256 tokenId = nextTokenIdToMint();
    
        _coordinatesToTokenId[x][y] = tokenId;
    
        mintTo(msg.sender, fullURI);
    }


    function tokenIdByCoordinates(uint256 x, uint256 y) public view returns (uint256) {
        require(doesPlotExist(x, y), "No token exists for these coordinates");
        return _coordinatesToTokenId[x][y];
    }

    function getPlotURI(uint256 x, uint256 y) public view returns (string memory) {
        require(doesPlotExist(x, y), "Plot does not exist");
    
        uint256 tokenId = _coordinatesToTokenId[x][y];
        return tokenURI(tokenId);
    }

    function doesPlotExist(uint256 x, uint256 y) public view returns (bool) {
        return _coordinatesToTokenId[x][y] != 0;
    }
}