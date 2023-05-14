import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Polymer} from "../../domain/interfaces/polymer";

@Component({
  selector: 'app-polymers',
  templateUrl: './polymers.component.html',
  styleUrls: ['./polymers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolymersComponent {
  @Input() data!: Polymer[]
}
