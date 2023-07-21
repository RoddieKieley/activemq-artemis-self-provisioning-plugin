import { useTranslation } from '../../../../i18n';
import {
  TableColumn,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { Status } from './Status.container';
import { StatusRow } from './StatusRow';
import { PageSection, Title } from '@patternfly/react-core';

export type StatusProps = {
  isLoaded: boolean;
  loadError: boolean;
  statusData: Status[];
};

const Status: React.FC<StatusProps> = ({ isLoaded, loadError, statusData }) => {
  const { t } = useTranslation();

  const columns: TableColumn<Status>[] = [
    {
      title: t('name'),
      id: 'name',
    },
    {
      title: t('version'),
      id: 'version',
    },
    {
      title: t('uptime'),
      id: 'uptime',
    },
    {
      title: t('addressMemoryUsage'),
      id: 'addressMemoryUsage',
    },
  ];
  return (
    <>
      <PageSection>
        <Title headingLevel="h1">{t('status')}</Title>
      </PageSection>
      <VirtualizedTable<Status>
        data={statusData}
        unfilteredData={statusData}
        loaded={isLoaded}
        loadError={loadError}
        columns={columns}
        Row={({ obj, activeColumnIDs, rowData }) => (
          <StatusRow
            obj={obj}
            rowData={rowData}
            activeColumnIDs={activeColumnIDs}
            columns={columns}
          />
        )}
      />
    </>
  );
};

export { Status };
