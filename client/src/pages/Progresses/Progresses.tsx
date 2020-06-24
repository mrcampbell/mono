import React, { useState, useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/react-hooks";
import {
  QUERY_PROGRESSES,
  SUBSCRIPTION_PROGRESSES,
} from "../../graphql/queries";
export default () => {
  const [progresses, setProgresses] = useState({});

  const {
    data: initial_progresses_data,
    loading: loading_initial_progresses,
    error: initial_progresses_error,
  } = useQuery(QUERY_PROGRESSES);

  useEffect(() => {
    if (initial_progresses_data) {
      initial_progresses_data.progresses.forEach((p: any) => {
        setProgresses({ ...progresses, [p.date_key]: p });
      });
    }
  }, [initial_progresses_data])


  useSubscription(SUBSCRIPTION_PROGRESSES, {
    onSubscriptionData: (options: any) => {
      const updatedProgresses = options.subscriptionData.data.progresses;
      updatedProgresses.forEach((p: any) => { // todo: is this scalable?
        setProgresses({ ...progresses, [p.date_key]: p });
      });
    },
  });

  if (loading_initial_progresses) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ProgressesPage">
      <pre>{JSON.stringify(progresses, null, 2)}</pre>
    </div>
  );
};
