import React, { useContext } from "react";
import RecentEvent from "./RecentEvent";
import { useEffect } from "react";
import { GlobalContext } from "../../../global/globalContext/GlobalContext";

const Events = () => {
  const { setInfraActiveTab, setInfraInfoActiveTab } =
    useContext(GlobalContext);
  useEffect(() => {
    setInfraActiveTab(0);
    setInfraInfoActiveTab(2);
  }, []);

  return (
    <div>
      <RecentEvent />
    </div>
  );
};

export default Events;
