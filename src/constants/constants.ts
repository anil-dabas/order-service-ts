export{};

export const ALCHEMY_PROJECT_URL = 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID';
export const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-perps';

export const SMART_MARGIN_ORDERS_QUERY = `
  {
    smartMarginOrders(where: { orderType: Limit }) {
      id
      account
      orderType
      marketKey
      recordTrade
      feesPaid
    }
  }
`;