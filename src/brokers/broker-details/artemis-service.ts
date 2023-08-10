import { consoleFetchJSON } from '@openshift-console/dynamic-plugin-sdk';
import { SortByDirection } from '@patternfly/react-table';

// const BROKER_SEARCH_PATTERN = "org.apache.activemq.artemis:broker=*";
// const LIST_NETWORK_TOPOLOGY_SIG = "listNetworkTopology";
// const SEND_MESSAGE_SIG = "sendMessage(java.util.Map, int, java.lang.String, boolean, java.lang.String, java.lang.String, boolean)";
// const DELETE_ADDRESS_SIG = "deleteAddress(java.lang.String)";
// const CREATE_QUEUE_SIG = "createQueue(java.lang.String, boolean)"
// const CREATE_ADDRESS_SIG = "createAddress(java.lang.String, java.lang.String)"
// const COUNT_MESSAGES_SIG = "countMessages()";
// const COUNT_MESSAGES_SIG2 = "countMessages(java.lang.String)";
// const BROWSE_SIG = "browse(int, int, java.lang.String)";
// const LIST_PRODUCERS_SIG = "listProducers(java.lang.String, int, int)";
// const LIST_CONNECTIONS_SIG = "listConnections(java.lang.String, int, int)";
// const LIST_SESSIONS_SIG = "listSessions(java.lang.String, int, int)";
// const LIST_CONSUMERS_SIG = "listConsumers(java.lang.String, int, int)";
// const LIST_ADDRESSES_SIG = "listAddresses(java.lang.String, int, int)";
const LIST_QUEUES_SIG = 'listQueues(java.lang.String, int, int)';
// const DESTROY_QUEUE_SIG = "destroyQueue(java.lang.String)";
// const REMOVE_ALL_MESSAGES_SIG = "removeAllMessages()";
// const CLOSE_CONNECTION_SIG = "closeConnectionWithID(java.lang.String)";
// const CLOSE_SESSION_SIG = "closeSessionWithID(java.lang.String,java.lang.String)";

export type ActiveSort = {
  id: string;
  order: SortByDirection;
};

export type Filter = {
  column: string;
  operation: string;
  input: string;
};

export const useGetQueues = () => {
  return async (
    page: number,
    perPage: number,
    activeSort: ActiveSort,
    filter: Filter,
  ) => {
    const { column, operation, input } = filter;
    const { id, order } = activeSort;

    const filterQuery = JSON.stringify({
      field: input !== '' ? column : '',
      operation: input !== '' ? operation : '',
      value: input,
      sortOrder: order,
      sortColumn: id,
    });

    const url = `http://localhost:8161/console/jolokia/exec/org.apache.activemq.artemis:broker="0.0.0.0"/${LIST_QUEUES_SIG}/${filterQuery}/${page}/${perPage}`;
    return await consoleFetchJSON(url);
  };
};
