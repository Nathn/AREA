import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { AutomationsGraph } from '@/components/dashboard/overview/automations-graph';
import { Logs } from '@/components/dashboard/overview/logs';
import { ServicesChart } from '@/components/dashboard/overview/services-chart';
import { ServicesProgress } from '@/components/dashboard/overview/services-progress';
import { TotalAutomations } from '@/components/dashboard/overview/total-automations';
import { UniqueActions } from '@/components/dashboard/overview/unique-actions';
import { UniqueReactions } from '@/components/dashboard/overview/unique-reactions';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <TotalAutomations diff={12} trend="down" sx={{ height: '100%' }} value="5.1k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <UniqueActions diff={7} trend="up" sx={{ height: '100%' }} value="16" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <UniqueReactions diff={0} trend="down" sx={{ height: '100%' }} value="4" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <ServicesProgress sx={{ height: '100%' }} value={58.3} />
      </Grid>
      <Grid lg={8} xs={12}>
        <AutomationsGraph
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <ServicesChart chartSeries={[63, 15, 22]} labels={['Reddit', 'Github', 'YouTube']} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={12} md={12} xs={12}>
        <Logs
          orders={[
            {
              id: '51d65azd0',
              action: 'Reddit - New post',
              customer: { name: 'Gmail - Send an email' },
              amount: 30.5,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: '51d65azc9',
              action: 'Drive - New file uploaded',
              customer: { name: 'YouTube - Post a comment' },
              amount: 25.1,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: '51d65azc8',
              action: 'Reddit - New post',
              customer: { name: 'Gmail - Send an email' },
              amount: 10.99,
              status: 'refunded',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: '51d65azc7',
              action: 'Github - New issue created',
              customer: { name: 'Gmail - Send an email' },
              amount: 96.43,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: '51d65azc6',
              action: 'Reddit - New comment',
              customer: { name: 'Reddit - Create a post' },
              amount: 32.54,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: '51d65azc5',
              action: 'Reddit - New post',
              customer: { name: 'YouTube - Post a comment' },
              amount: 16.76,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
