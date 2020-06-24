import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import CreateTaskCondition from "../../components/CreateTaskCondition/CreateTaskCondition";
export default () => {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>All</Tab>
          <Tab>New</Tab>
        </TabList>

        <TabPanel>
          <h2>Any content 1</h2>
        </TabPanel>
        <TabPanel>
          <h2>Create Task Conditions</h2>
          <CreateTaskCondition />
        </TabPanel>
      </Tabs>
    </div>
  );
};
