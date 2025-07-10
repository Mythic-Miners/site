import { createThirdwebClient } from 'thirdweb';
import { hardhat, polygon } from 'thirdweb/chains';
import { inAppWallet } from 'thirdweb/wallets';

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
  throw new Error('No client ID provided');
}

export const client = createThirdwebClient({
  clientId,
});

export const wallets = [
  inAppWallet({
    auth: {
      options: ['email', 'google', 'apple', 'facebook'],
    },
  }),
];

export const chain = process.env.NODE_ENV === 'production' ? polygon : hardhat;
