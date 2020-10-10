import {ActivatedRoute, Params} from '@angular/router';
import {ConsumerAppService} from '../consumer-app.service';

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChartDataSets, ChartOptions} from 'chart.js';
import {BaseChartDirective, Color, Label} from 'ng2-charts';
import {WorkerInfo} from './worker-info.model';

@Component({
  selector: 'app-consumer-app',
  templateUrl: './consumer-app.component.html',
  styleUrls: ['./consumer-app.component.css']
})
export class ConsumerAppComponent implements OnInit, OnDestroy {

  public consumerAppId: string = null;
  public consumerAppType: string = null;
  private pollInfosFetchIntervalId = null;
  private consumingStateFetchIntervalId = null;

  public lineChartData: ChartDataSets[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'poll method calls'}
  ];

  public workersData: WorkerInfo[] = [];

  public lastPollRecordsCount: number = 0;
  public recordProcessingDurationMs: number = 0;

  public lineChartLabels: Label[] = [];

  public lineChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      animateScale: false,
      animateRotate: false,
      duration: 0
    },
    scales: {
      xAxes: [{
        display: true,
        ticks: {
          display: false
        }
      }],

      yAxes: [{
        display: true,
        ticks: {
          display: false,
          beginAtZero: true
        }
      }]
    }
  };

  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';

  @ViewChild(BaseChartDirective, {static: true}) chart: BaseChartDirective;

  constructor(private route: ActivatedRoute, private consumerAppService: ConsumerAppService) {
  }


  ngOnInit() {

    this.route.params.subscribe((customerParams: Params) => {

      this.stopDataFetch();

      this.consumerAppId = customerParams.id;
      this.pollInfosFetchIntervalId = setInterval(function(ev) {
        this.fetchPollInfo();
      }.bind(this), 50);

      this.consumingStateFetchIntervalId = setInterval(function(ev) {
        this.fetchConsumingStateData();
      }.bind(this), 20);
    });

  }

  private stopDataFetch() {
    if (this.pollInfosFetchIntervalId) {
      console.log('Clearing  pollInfosFetchIntervalId: ' + this.pollInfosFetchIntervalId);
      clearInterval(this.pollInfosFetchIntervalId);
    }

    if (this.consumingStateFetchIntervalId) {
      console.log('Clearing  pollInfosFetchIntervalId: ' + this.consumingStateFetchIntervalId);
      clearInterval(this.consumingStateFetchIntervalId);
    }
  }

  private fetchPollInfo() {
    this.consumerAppService.fetchPollInfo(this.consumerAppId)
      .subscribe(pollInfos => {
        let labels: Label[] = [];
        let data = [];
        let i = 0;
        // console.log(pollInfos);

        for (const pollInfo of pollInfos) {
          labels.push(i % 10 == 0 ? 'I' : '.');
          data.push(pollInfo.pollCount);
          i++;
        }
        this.lineChartLabels = labels;
        this.lineChartData[0].data = data;
      });
  }

  private fetchConsumingStateData() {
    if (this.consumerAppId) {
      this.consumerAppService.fetchConsumingStateData(this.consumerAppId).subscribe(csd => {
        this.workersData = csd.workerInfos.map(w => new WorkerInfo(w.totalRecords, w.processedRecords, w.threadName));
        this.lastPollRecordsCount = csd.lastPollRecordsCount;
        this.recordProcessingDurationMs = csd.recordProcessingDurationMs;
        this.consumerAppType = csd.type.toLowerCase().replace('_', ' ');
        // console.log(csd);
      });
    }

  }


  ngOnDestroy(): void {
    this.stopDataFetch();
  }


  public updateRecordProcessingDuration(consumerAppId: string, durationMs: number) {
    this.consumerAppService.updateRecordProcessingDuration(consumerAppId, durationMs);
  }


}
