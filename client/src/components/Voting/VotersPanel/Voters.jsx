import { useState, useEffect } from "react";
import useEth from "../../../contexts/EthContext/useEth";

function Voters() {
  const [votersAddresses, setVotersAddresses] = useState([]);
  const [eventList, setEventList] = useState([]);

  const {
    state: { contract },
  } = useEth();

  useEffect(() => {
    (async function () {
      let oldEvents = await contract.getPastEvents("VoterRegistered", {
        fromBlock: 0,
        toBlock: "latest",
      });

      let oldies = [];
      oldEvents.forEach((event) => {
        oldies.push(event.returnValues.voterAddress);
      });
      console.log("OLDIES : ", oldies);

      setVotersAddresses(oldies);

      await contract.events
        .VoterRegistered({ fromBlock: "earliest" })
        .on("data", (event) => {
          console.log("New event", event);
          let newEvent = event.returnValues.voterAddress;

          setVotersAddresses((votersAddresses) => [
            ...votersAddresses,
            newEvent,
          ]);
        })
        .on("changed", (changed) => console.log(changed))
        .on("error", (err) => console.error(err))
        .on("connected", (str) =>
          console.log("Connected subscription ID : ", str)
        );
    })();
  }, []);

  useEffect(() => {
    const votersLi = votersAddresses.map((data) => {
      return <li key={data}>{data}</li>;
    });
    setEventList(votersLi);
  }, [votersAddresses]);

  return (
    <>
      <h3>Voters list</h3>
      <div>
        {eventList.length > 0 ? (
          <ul>{eventList}</ul>
        ) : (
          "No voters registered yet"
        )}
      </div>
    </>
  );
}

export default Voters;
