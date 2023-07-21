import { FC } from 'react';
import {
  RowProps,
  TableData,
  TableColumn,
  Timestamp,
} from '@openshift-console/dynamic-plugin-sdk';
import { Status } from './Status.container';

export type StatusRowProps = RowProps<Status> & {
  columns: TableColumn<Status>[];
};

export const StatusRow: FC<StatusRowProps> = ({
  obj,
  activeColumnIDs,
  columns,
}) => {
  const { name, version, uptime, addressMemoryUsage } = obj;
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        {name}
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {version}
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={uptime} />
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={addressMemoryUsage} />
      </TableData>
    </>
  );
};
