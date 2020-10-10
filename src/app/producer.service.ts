import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProducerInfo} from './sidebar/producer.model';


@Injectable({
  providedIn: 'root'
})
export class ProducerService {

  constructor(private http: HttpClient) {
  }

  public getProducerList(): Observable<ProducerInfo[]> {
    const fullUrl = environment.producerBaseUrl;
    return this.http.get<ProducerInfo[]>(fullUrl);
  }

  public startProducer(topic: string): Observable<ProducerInfo> {
    const fullUrl = environment.producerBaseUrl;
    const producerInfo = new ProducerInfo(undefined, topic, 1);
    return this.http.post<ProducerInfo>(fullUrl, producerInfo);
  }

  public stopProducer(producerId: string): Observable<ProducerInfo> {
    const fullUrl = environment.producerBaseUrl + '/' + producerId + '/stop';
    return this.http.get<ProducerInfo>(fullUrl);
  }


  public updateProducerSpeed(producerId: string, newSpeedMsgPerSec: number): Observable<boolean> {
    const fullUrl = environment.producerBaseUrl + '/' + producerId + '/speed/' + newSpeedMsgPerSec;
    return this.http.get<boolean>(fullUrl);
  }
}
