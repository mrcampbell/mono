import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import ListTaskConditions from "../../components/ListTaskConditions/ListTaskConditions";
import EditTaskCondition from "../../components/EditTaskCondition/EditTaskCondition";
export default () => {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>All</Tab>
          <Tab>New</Tab>
        </TabList>
        <TabPanel>
          <h2>All Task Conditions</h2>
          <ListTaskConditions />
        </TabPanel>
        <TabPanel>
          <h2>Create Task Conditions</h2>
          <EditTaskCondition />
        </TabPanel>
      </Tabs>
    </div>
  );
};
