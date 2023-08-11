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

    // http is unsecured
    // https if secured via tls
    // if so need the cert and potentially CA info
    const defaultProtocol = 'http';

    // could also be username@password after the ://
    const defaultUsernameColonPasswordAt = '';

    // If specified, the fully qualified Pod hostname will be "<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>". If not specified, the pod will not have a domainname at all.
    // e.g. example1-ss-1.example1-hdls-svc.amq1.svc.cluster.local
    // where
    // example1 is the CR name
    // example1-ss is the statefulset name
    // example1-ss-1 is the pod name (ordinal 1, i.e. the 2nd pod in the statefulset)
    // example1-hdls-svc is the headless service for CR name example1
    // amq1 is the namespacename
    // .svc is used for services in k8s
    // .cluster.local is the domainname (in this case the default)
    // crname-ss-ordinal OR
    // crname-ss-ordinal.crname-hdls-svc.namespace OR
    // crname-ss-ordinal.crname-hdls-svc.namespace.svc OR fully qualified as
    // crname-ss-ordinal.crname-hdls-svc.namespace.svc.cluster.local (default cluster domain but could be custom)
    //
    // likely all we need here is crname-ss-ordinal.crname-hdls-svc.namespace
    const defaultHostname = 'localhost';

    // need to lookup the console-jolokia named port on the hdls service
    const defaultPort = '8161';

    // need to see if the jolokiaAgent is enabled in the CR
    // console/jolokia is the default
    // if the agent is enabled it'll be just jolokia i.e. localhost:8161/jolokia
    const defaultJolokiaEndpoint = 'console/jolokia';

    // currently the broker name is always 0.0.0.0 as of 08/11/23
    // however this should be fixed
    const defaultBrokerName = '0.0.0.0';

    // const url = `http://localhost:8161/console/jolokia/exec/org.apache.activemq.artemis:broker="0.0.0.0"/${LIST_QUEUES_SIG}/${filterQuery}/${page}/${perPage}`;
    const url = `${defaultProtocol}://${defaultUsernameColonPasswordAt}${defaultHostname}:${defaultPort}/${defaultJolokiaEndpoint}/exec/org.apache.activemq.artemis:broker="${defaultBrokerName}"/${LIST_QUEUES_SIG}/${filterQuery}/${page}/${perPage}`;
    return await consoleFetchJSON(url);
  };
};
