export{};

export const ALCHEMY_PROJECT_URL = 'https://opt-mainnet.g.alchemy.com/v2/bSArc9MOcsd_RD_fP40OIGv02-OZFrFk';
export const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-perps';
export const CONTRACT_ADDRESS = "0xc3d16e00833355b48d2fD69D838c6ACF004cf4b6";
export const BATCH_SIZE = 2000;
export const START_BLOCK = 120000000;

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
export const EVENT_TYPE = {
  ConditionalOrderPlaced: 'ConditionalOrderPlaced',
  ConditionalOrderFilled: 'ConditionalOrderFilled',
  ConditionalOrderCancelled: 'ConditionalOrderCancelled'
};