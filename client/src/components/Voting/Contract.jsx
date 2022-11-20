import { useRef, useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Contract({ value }) {
  const spanEle = useRef(null);
  const [EventValue, setEventValue] = useState([]);
  const [oldEvents, setOldEvents] = useState();

  const {
    state: { contract, accounts },
  } = useEth();

  useEffect(() => {
    (async function () {
      let oldEvents = await contract.getPastEvents("VoterRegistered", {
        fromBlock: 0,
        toBlock: "latest",
      });
      let oldies = [];
      oldEvents.forEach((event) => {
        console.log("Past event : ", event);
        oldies.push(event.returnValues.voterAddress);
      });

      const votersLi = oldies.map((data, idx) => {
        return <li key={data}>{data}</li>;
      });
      setOldEvents(votersLi);

      await contract.events
        .VoterRegistered({ fromBlock: "earliest" })
        .on("data", (event) => {
          console.log("Event", event);
          let lesevents = event.returnValues.voterAddress;
          setEventValue((EventValue) => [...EventValue, lesevents]);
        })
        .on("changed", (changed) => console.log(changed))
        .on("error", (err) => console.error(err))
        .on("connected", (str) =>
          console.log("Connected subscription ID : ", str)
        );
    })();
  }, [contract]);

  return (
    <div>
      <ul>{oldEvents}</ul>
    </div>
    //     <code>
    //       {`Voter(s) added : `}{EventValue}
    //       {`contract SimpleStorage {
    //   uint256 value = `}
    //       <li>{EventValue}</li>

    //       <span className="secondary-color" ref={spanEle}>
    //         <strong>{value}</strong>
    //       </span>

    //       {`;

    //   function read() public view returns (uint256) {
    //     return value;
    //   }

    //   function write(uint256 newValue) public {
    //     value = newValue;
    //   }
    // }`}
    //     </code>
  );
}

export default Contract;
