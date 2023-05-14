import {Component, Inject, Injector, Input, OnInit} from '@angular/core';
import {Polymer} from "../../domain/interfaces/polymer";
import {TuiDialogService} from "@taiga-ui/core";
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
import {PolymerFormComponent} from "../polymer-form/polymer-form.component";
import {Observable} from "rxjs";
import {ApiPolymersClient} from "../../services/api-polymers.client";

@Component({
  selector: 'app-polymer-card',
  templateUrl: './polymer-card.component.html',
  styleUrls: ['./polymer-card.component.scss']
})
export class PolymerCardComponent implements OnInit {
  public expanded: boolean = false;
  @Input() polymerData!: Polymer;
  private dialog!: Observable<any>;

  constructor(@Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector,
              private readonly api: ApiPolymersClient) {
  }

  ngOnInit() {
    this.dialog = this.dialogs.open<Polymer>(
      new PolymorpheusComponent(PolymerFormComponent, this.injector),
      {
        data: this.polymerData,
        dismissible: true,
        label: this.polymerData.name,
        size: 'l'
      },
    );
  }

  public editPolymer() {
    this.dialog.subscribe({
      next: data => this.api.editPolymer(data),
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  public toggle(): void {
    this.expanded = !this.expanded;
  }
}
