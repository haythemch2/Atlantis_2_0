import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;

export const client = createThirdwebClient({
  clientId: clientId,
});

export const AtlantisContract = getContract({ 
    client: client, 
    chain: sepolia, 
    address: import.meta.env.VITE_TEMPLATE_LOTTO_CONTRACT_ADDRESS,
  });