// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract LogicV2 is Initializable {
    function initialize() public initializer {}
    mapping(string => uint256) private uint256Params;

    event Uint256ParamSetted(string indexed _key, uint256 _value);

    function SetUint256Param(string memory _key, uint256 _value) external {
        uint256Params[_key] = _value;
        emit Uint256ParamSetted(_key, _value);
    }

    function GetUint256Param(string memory _key) public view returns (uint256) {
        uint256 ret = uint256Params[_key] + 1;
        return ret;
    }
}
