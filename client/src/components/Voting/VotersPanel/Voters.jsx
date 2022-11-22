import { useState, useEffect } from "react";
import useEth from "../../../contexts/EthContext/useEth";

function Voters() {
  const [votersAddresses, setVotersAddresses] = useState([]);
  const [votersList, setVotersList] = useState([]);

  const {
    state: { contract },
  } = useEth();

  useEffect(() => {
    (async function () {
      if (contract) {
        let oldEvents = await contract.getPastEvents("VoterRegistered", {
          fromBlock: 0,
          toBlock: "latest",
        });

        let addresses = [];
        oldEvents.forEach((event) => {
          addresses.push(event.returnValues.voterAddress);
        });
        console.log("Old events VoterRegistered : ", addresses);

        setVotersAddresses(addresses);

        await contract.events
          .VoterRegistered({ fromBlock: "earliest" })
          .on("data", (event) => {
            console.log("New event VoterRegistered", event);
            let newAddress = event.returnValues.voterAddress;
            if (!votersAddresses.includes(newAddress)) {
              setVotersAddresses((votersAddresses) => [
                ...votersAddresses,
                newAddress,
              ]);
            }
          })
          .on("changed", (changed) => console.log(changed))
          .on("error", (err) => console.error(err))
          .on("connected", (str) =>
            console.log("Connected subscription ID : ", str)
          );
      }
    })();
  }, [contract]);

  useEffect(() => {
    const votersLi = votersAddresses.map((data) => {
      return (
        <li key={data} className="design-padd">
          {data}
        </li>
      );
    });
    setVotersList(votersLi);
  }, [votersAddresses]);

  return (
    <>
      <div>
        {votersList.length > 0 ? (
          <ul>{votersList}</ul>
        ) : (
          "No voters registered yet"
        )}
      </div>
    </>
  );
}

export default Voters;
