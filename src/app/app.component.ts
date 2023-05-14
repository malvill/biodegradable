import {Component, Inject, Injector} from '@angular/core';
import {TuiDialogService} from "@taiga-ui/core";
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
import {PolymerFormComponent} from "./components/polymer-form/polymer-form.component";
import {Polymer} from "./domain/interfaces/polymer";
import {BehaviorSubject} from "rxjs";
import {ApiPolymersClient} from "./services/api-polymers.client";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public polymers$: BehaviorSubject<Polymer[]> = new BehaviorSubject<Polymer[]>([])
  private readonly dialog = this.dialogs.open<Polymer>(
    new PolymorpheusComponent(PolymerFormComponent, this.injector),
    {
      dismissible: true,
      label: 'Новый полимер',
      size: 'l'
    },
  );
  title = 'biodegradable';

  constructor(@Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector,
              private readonly api: ApiPolymersClient) {
    this.api.getPolymers().pipe(takeUntilDestroyed()).subscribe((polymers: Polymer[]) => this.polymers$.next(polymers))
  }

  public openPolymerCreationForm(): void {
    this.dialog.subscribe({
      next: data => this.addPolymer(data),
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  private addPolymer(data: Polymer) {
    this.api.addNewPolymer(data)
  }
}
