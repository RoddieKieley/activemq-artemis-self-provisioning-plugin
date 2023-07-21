import { FC, useEffect, useState } from 'react';
import { Status } from './Status.component';

export type Status = {
  name: string;
  version: number;
  uptime: Date;
  addressMemoryUsage: Date;
};

const StatusContainer: FC = () => {
  const [statusData, setStatusData] = useState<Status[]>([]);
  const getStatusData = () => {
    setStatusData([
      {
        name: 'build-infra-beef',
        version: 1,
        uptime: new Date('2023-07-06,02:04:08'),
        addressMemoryUsage: new Date('Fri Jul 07 2023,02:04:08'),
      },
    ]);
  };

  useEffect(() => {
    getStatusData();
  }, []);
  return <Status statusData={statusData} isLoaded={true} loadError={null} />;
};

export { StatusContainer };
