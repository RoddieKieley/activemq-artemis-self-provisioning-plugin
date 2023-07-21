import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Status, StatusProps } from './Status.component';

export default {
  title: 'Status',
  component: Status,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Status>;

const props: StatusProps = {
  statusData: [
    {
      name: 'build-infra-beef',
      version: 1,
      uptime: new Date('2023-07-06,02:04:08'),
      addressMemoryUsage: new Date('Fri Jul 07 2023,02:04:08'),
    },
  ],
  isLoaded: true,
  loadError: null,
};
const Template: ComponentStory<typeof Status> = () => <Status {...props} />;

export const StatusPageStory = Template.bind({});
