import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PollInfo} from './consumer-app/poll-info.model';
import {ConsumerAppInfo, ConsumingStateData} from './consumer-app/consumer-data.model';


@Injectable({
  providedIn: 'root'
})
export class ConsumerAppService {


  constructor(private http: HttpClient) {
  }

  public getConsumerAppTypes(): Observable<string[]> {
    const fullUrl = environment.consumerAppBaseUrl + '/list-types';
    return this.http.get<string[]>(fullUrl);
  }

  public getConsumerAppList(): Observable<ConsumerAppInfo[]> {
    const fullUrl = environment.consumerAppBaseUrl;
    return this.http.get<ConsumerAppInfo[]>(fullUrl);
  }

  public startConsumerApp(appType: string, consumeTopic: string): Observable<ConsumerAppInfo> {
    const fullUrl = environment.consumerAppBaseUrl;
    const appInfo = new ConsumerAppInfo(appType, consumeTopic, undefined);
    return this.http.post<ConsumerAppInfo>(fullUrl, appInfo);
  }

  public stopConsumerApp(appId: string): Observable<ConsumerAppInfo> {
    const fullUrl = environment.consumerAppBaseUrl + '/' + appId + '/stop' ;
    return this.http.get<ConsumerAppInfo>(fullUrl);
  }

  public fetchPollInfo(consumerAppId: string): Observable<PollInfo[]> {
    const fullUrl = environment.consumerAppBaseUrl + '/' + consumerAppId + '/poll-history';
    return this.http.get<PollInfo[]>(fullUrl);
  }

  public fetchConsumingStateData(consumerAppId: string): Observable<ConsumingStateData> {
    const fullUrl = environment.consumerAppBaseUrl + '/' + consumerAppId + '/state';
    return this.http.get<ConsumingStateData>(fullUrl);
  }


  public updateRecordProcessingDuration(consumerAppId: string, durationMs) {
    const fullUrl = environment.consumerAppBaseUrl + '/' + consumerAppId + '/record-processing-duration/' + durationMs;
    return this.http.get<boolean>(fullUrl).subscribe(result => {
    });
  }

}
