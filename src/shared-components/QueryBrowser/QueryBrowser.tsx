import { FC, useCallback } from 'react';
import _ from 'lodash';
import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLegend,
  ChartLine,
  ChartThemeColor,
  ChartVoronoiContainer,
  ChartVoronoiContainerProps,
} from '@patternfly/react-charts';
import {
  PrometheusLabels,
  PrometheusResponse,
  PrometheusResult,
} from '@openshift-console/dynamic-plugin-sdk';
import { ChartSkeletonLoader } from '../../brokers/metrics/components/ChartSkeletonLoader/ChartSkeletonLoader';
import { EmptyStateNoMetricsData } from '../../brokers/metrics/components/EmptyStateNoMetricsData/EmptyStateNoMetricsData';
import { chartHeight, chartPadding } from '../../utils';
import { useChartWidth } from '../../brokers/metrics/hooks/useChartWidth';
import { useTranslation } from '../../i18n';
import {
  chartTheme,
  AxisDomain,
  FormatSeriesTitle,
  GraphSeries,
  GraphDataPoint,
  // getXDomain,
  Series,
  formatSeriesValues,
  xAxisTickFormat,
  DataPoint,
} from '../../brokers/metrics/utils';

const colors = chartTheme.line.colorScale;

export type QueryBrowserProps = {
  allMetricsSeries: PrometheusResponse[];
  span: number;
  isLoading: boolean;
  defaultSamples?: number;
  fixedXDomain: AxisDomain;
  samples: number;
  formatSeriesTitle?: FormatSeriesTitle;
  yTickFormat: (v: number) => string;
  processedData?: DataPoint<string | number | Date>[][];
  // data: GraphSeries[]
  metricsType?: 'memory' | 'cpu';
  label?: any;
  ariaTitle: string;
};

export const QueryBrowser: FC<QueryBrowserProps> = ({
  allMetricsSeries,
  span,
  isLoading,
  fixedXDomain,
  samples,
  formatSeriesTitle,
  yTickFormat,
  processedData,
  // data,
  metricsType,
  label,
  ariaTitle,
}) => {
  const { t } = useTranslation();
  const [containerRef, width] = useChartWidth();
  // const [xDomain, setXDomain] = useState(fixedXDomain || getXDomain(Date.now(), span));

  const data: GraphSeries[] = [];
  const tooltipSeriesNames: string[] = [];
  const tooltipSeriesLabels: PrometheusLabels[] = [];
  const legendData: { name: string }[] = [];
  const domain = { x: fixedXDomain, y: fixedXDomain };
  const xAxisTickCount = Math.round(width / 100);

  const newResult = _.map(allMetricsSeries, 'data.result');
  const hasMetrics = _.some(newResult, (r) => (r && r.length) > 0);

  // Only update X-axis if the time range (fixedXDomain or span) or graph data (allSeries) change
  // useEffect(() => {
  //   setXDomain(fixedXDomain || getXDomain(Date.now(), span));
  // }, [allMetricsSeries, span, fixedXDomain]);

  const newGraphData = _.map(newResult, (result: PrometheusResult[]) => {
    return _.map(result, ({ metric, values }): Series => {
      return [metric, formatSeriesValues(values, samples, span)];
    });
  });

  _.each(newGraphData, (series, i) => {
    _.each(series, ([metric, values]) => {
      data.push(values);
      if (formatSeriesTitle) {
        const name = formatSeriesTitle(metric, i);
        legendData.push({ name });
        tooltipSeriesNames.push(name);
      } else {
        tooltipSeriesLabels.push(metric);
      }
    });
  });

  const xTickFormat = useCallback(
    (tick) => {
      const tickFormat = xAxisTickFormat(span);
      return tickFormat(tick);
    },
    [xAxisTickFormat, span],
  );

  // Set a reasonable Y-axis range based on the min and max values in the data
  const findMin = (series: GraphSeries): GraphDataPoint => _.minBy(series, 'y');
  const findMax = (series: GraphSeries): GraphDataPoint => _.maxBy(series, 'y');
  let minY: number = findMin(data.map(findMin))?.y ?? 0;
  let maxY: number = findMax(data.map(findMax))?.y ?? 0;
  if (minY === 0 && maxY === 0) {
    minY = 0;
    maxY = 1;
  } else if (minY > 0 && maxY > 0) {
    minY = 0;
  } else if (minY < 0 && maxY < 0) {
    maxY = 0;
  }

  domain.y = [minY, maxY];

  const metricsDataPoints = metricsType === 'memory' ? processedData : data;

  return (
    <div ref={containerRef} style={{ height: '500px' }}>
      {(() => {
        switch (true) {
          case isLoading:
            return <ChartSkeletonLoader />;
          case !hasMetrics:
            return <EmptyStateNoMetricsData />;
          default: {
            const labels: ChartVoronoiContainerProps['labels'] = ({
              datum,
            }) => {
              const time = xTickFormat(datum.x);
              let label = '';

              if (metricsType === 'memory') {
                label = `${datum?.style?.labels?.name}: ${yTickFormat(
                  datum.y,
                )} at ${xTickFormat(datum.x)}`;
              } else if (metricsType === 'cpu') {
                label = `${datum?.style?.labels?.name}: ${yTickFormat(
                  datum.y,
                )} at ${time}`;
              }
              return label;
            };

            return (
              <Chart
                ariaTitle={ariaTitle}
                // containerComponent={graphContainer}
                containerComponent={
                  <ChartVoronoiContainer
                    labels={labels}
                    constrainToVisibleArea
                  />
                }
                legendComponent={<ChartLegend data={legendData} />}
                legendAllowWrap={true}
                legendPosition="bottom-left"
                scale={{ x: 'time', y: 'linear' }}
                domain={domain}
                height={chartHeight}
                padding={chartPadding}
                domainPadding={{ y: 20 }}
                width={width}
                themeColor={ChartThemeColor.multiUnordered}
              >
                <ChartAxis
                  label={'\n' + t('axis_label_time')}
                  tickCount={xAxisTickCount}
                  tickFormat={xTickFormat}
                />
                <ChartAxis
                  label={label}
                  crossAxis={false}
                  tickCount={6}
                  dependentAxis
                  tickFormat={yTickFormat}
                />
                <ChartGroup>
                  {metricsDataPoints.map((values, index) => {
                    if (values === null) {
                      return null;
                    }

                    const color = colors[index % colors.length];
                    const style = {
                      data: { stroke: color },
                      labels: {
                        fill: color,
                        labels: tooltipSeriesLabels[index],
                        name: tooltipSeriesNames[index],
                      },
                    };

                    return (
                      <ChartLine
                        key={`chart-line-${index}`}
                        data={values}
                        groupComponent={<g />}
                        name={`series-${index}`}
                        style={style}
                      />
                    );
                  })}
                </ChartGroup>
              </Chart>
            );
          }
        }
      })()}
    </div>
  );
};
