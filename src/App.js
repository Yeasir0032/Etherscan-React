import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import TransactionItem from "./TransactionItem";
import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetails, setBlockDetails] = useState();
  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
      setBlockDetails(await alchemy.core.getBlock(blockNumber));
    }
    getBlockNumber();
  }, []);

  if (!blockDetails) return <div>Loading</div>;
  // console.log(blockDetails);
  return (
    <div className="App">
      <div className="block-header">
        Current Block <span>#{blockNumber}</span>
      </div>
      <div className="block-details">
        <div className="block-details-item">
          Hash: <span>{blockDetails.hash}</span>
        </div>
        <div className="block-details-item">
          Timestamp: <span>{calculateDate(blockDetails.timestamp)}</span>
        </div>
        <div className="block-details-item">
          Miner: <span>{blockDetails.miner}</span>
        </div>
        <div className="block-details-item">
          Transactions: <span>{blockDetails.transactions.length} items</span>
        </div>
      </div>
      {blockDetails.transactions.map((item) => (
        <TransactionItem transaction={item} key={item} />
      ))}
    </div>
  );
}

export default App;
function calculateDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const curDate = new Date();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const timeDif = curDate.getTime() - date.getTime();
  const remTime =
    timeDif / 60000 > 1
      ? timeDif / 3600000 > 1
        ? timeDif / 86400000 > 1
          ? `${Math.floor(timeDif / 86400000)} days`
          : `${Math.floor(timeDif / 3600000)} hrs`
        : `${Math.floor(timeDif / 60000)} mins`
      : `${Math.floor(timeDif / 1000)} secs`;
  return `${remTime} ago  ${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
}
