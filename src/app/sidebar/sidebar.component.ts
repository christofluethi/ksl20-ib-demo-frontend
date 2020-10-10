import {Component, OnInit} from '@angular/core';
import {ConsumerAppService} from '../consumer-app.service';
import {ConsumerAppInfo} from '../consumer-app/consumer-data.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ProducerService} from '../producer.service';
import {ProducerInfo} from './producer.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public consumerApps: ConsumerAppInfo[] = [];
  public producers: ProducerInfo[] = [];
  public consumerAppTypes: string[] = [];

  public produceTopic = 'unbalanced';
  public consumeTopic = 'unbalanced';

  constructor(private consumerAppService: ConsumerAppService,
              private producerService: ProducerService,
              private modalService: NgbModal,
              private router: Router) {
  }

  ngOnInit() {

    this.consumerAppService.getConsumerAppTypes().subscribe(result => {
      this.consumerAppTypes = result;
    });
    this.fetchConsumerList();
    this.fetchProducerList();
  }

  private fetchProducerList() {
    this.producerService.getProducerList().subscribe(result => {
      this.producers = result;
    });
  }

  private fetchConsumerList() {
    this.consumerAppService.getConsumerAppList().subscribe(result => {
      this.consumerApps = result;
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }


  protected startConsuming(impl: string) {
    this.consumerAppService.startConsumerApp(impl, this.consumeTopic)
      .subscribe(result => {
        console.log('Started ', impl, ' with result: ', result);
        this.fetchConsumerList();
      });
    this.modalService.dismissAll();
  }

  protected stopConsumer(consumerAppId: string) {
    this.consumerAppService.stopConsumerApp(consumerAppId)
      .subscribe(result => {
        console.log('Stropped ', consumerAppId, ' with result: ', result);
        this.fetchConsumerList();
      });
  }

  protected stopProducer(producerId: string) {
    this.producerService.stopProducer(producerId)
      .subscribe(result => {
        console.log('Stropped ', producerId, ' with result: ', result);
        this.fetchProducerList();
      });
  }

  protected startProducer() {
    console.log('Starting producer for topic: ', this.produceTopic);
    this.producerService.startProducer(this.produceTopic)
      .subscribe(result => {
        console.log('Started producer with result: ', result);
        this.fetchProducerList();
      });
    this.modalService.dismissAll();
  }

  protected updateRecordProcessingDuration(id: string, speedMs: number) {
    this.producerService.updateProducerSpeed(id, speedMs).subscribe(result => {
      console.log('Producer update speed result: ' + result);
      if (result) {
        this.producers.find(p => p.id === id).speed = speedMs;
      }
    });
  }
}
