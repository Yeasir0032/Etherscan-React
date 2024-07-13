import { Alchemy, Network } from "alchemy-sdk";
import React, { useEffect, useState } from "react";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const TransactionsItem = ({ transaction }) => {
  const [transactionDetails, setTDetails] = useState();
  const [canShow, setShow] = useState(false);
  const getReceipt = async () => {
    setTDetails(await alchemy.core.getTransactionReceipt(transaction));
  };

  return (
    <div className="t-item">
      Transaction Hash :- <span className="data">{transaction}</span>
      <div className="t-details">
        {transactionDetails ? (
          <div>
            <div>
              to: <span className="data">{transactionDetails.to}</span>
            </div>
            <div>
              from: <span className="data">{transactionDetails.from}</span>
            </div>
            <div>
              Gas Price:{" "}
              <span className="data">
                {getGasPrice(transactionDetails.effectiveGasPrice._hex)}
              </span>
            </div>
            <div>
              Gas Used:{" "}
              <span className="data">
                {parseInt(transactionDetails.gasUsed._hex, 16)}
              </span>
            </div>
          </div>
        ) : (
          <button onClick={getReceipt}>Get Receipt</button>
        )}
      </div>
    </div>
  );
};

export default TransactionsItem;
function getGasPrice(gas) {
  //Convert the gas which is in hex to decimal
  const gasPrice = parseInt(gas, 16);
  //Convert the gas price to gwei
  const gwei = gasPrice / 1000000000;
  //Ether
  const ether = gwei / 1000000000;
  return `${gwei} Gwei (${ether} Ether)`;
}
