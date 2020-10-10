import {WorkerInfo} from './worker-info.model';

export class ConsumingStateData {
  constructor(public is: string,
              public type: string,
              public workerInfos: WorkerInfo[],
              public lastPollRecordsCount: number,
              public recordProcessingDurationMs: number) {
  }
}

export class ConsumerAppInfo {

  constructor(public implementation: string,
              public topic: string,
              public id: string) {
  }
}
