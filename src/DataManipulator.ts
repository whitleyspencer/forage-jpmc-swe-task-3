import { ServerRespond } from './DataStreamer';


// Row matches the schema of the data table
export interface Row {
  price_stock1: number,
  price_stock2: number,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  timestamp: Date,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  /*
  calculate ratio between average price of two stocks and
  trigger alert if correlation is greater or less than upper bound and lower bound,
  returning data that will be displayed on each new row of graph
  */
  static generateRow(serverResponds: ServerRespond[]) {
    const priceStock1 = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2
    const priceStock2 = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2
    const ratio = priceStock1/priceStock2
    const upperBound = 1 + 0.05
    const lowerBound = 1 - 0.05
    const timestamp = serverResponds[0].timestamp > serverResponds[1].timestamp ?
      serverResponds[0].timestamp : serverResponds[1].timestamp
    const triggerAlert = (ratio > upperBound || ratio < lowerBound) ? ratio : undefined

    return {
      price_stock1: priceStock1,
      price_stock2: priceStock2,
      ratio: ratio,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      timestamp: timestamp,
      trigger_alert: triggerAlert,
    };
  }
}
