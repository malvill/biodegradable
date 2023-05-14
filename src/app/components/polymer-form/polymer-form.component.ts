import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  TuiFileLike,
  TuiFilesModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiMarkerIconModule,
  TuiTextAreaModule
} from "@taiga-ui/kit";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import {TuiButtonModule, TuiDialogContext, TuiSvgModule} from "@taiga-ui/core";
import {Polymer} from "../../domain/interfaces/polymer";
import {finalize, map, Observable, of, Subject, switchMap, timer} from "rxjs";
import {BiodegradationInfo} from "../../domain/interfaces/biodegradation-info";

@Component({
  selector: 'app-polymer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextAreaModule,
    TuiInputModule,
    TuiButtonModule,
    TuiSvgModule,
    TuiFilesModule,
    TuiMarkerIconModule,
    TuiInputFilesModule
  ],
  templateUrl: './polymer-form.component.html',
  styleUrls: ['./polymer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolymerFormComponent implements OnInit {
  public imgFileControl = new FormControl()
  public form!: FormGroup;
  public displayedImg?: string;

  constructor(@Inject(POLYMORPHEUS_CONTEXT)
              private readonly context: TuiDialogContext<Polymer, Polymer>) {
  }

  public ngOnInit() {
    const context: Polymer = this.context.data
    this.form = new FormGroup({
      name: new FormControl(context?.name, Validators.required),
      iupacName: new FormControl(context?.iupacName),
      polymerUnitImg: new FormControl(context?.polymerUnitImg),
      production: new FormControl(context?.production),
      toxicity: new FormControl(context?.toxicity),
      properties: new FormControl(context?.properties),
      solubility: new FormControl(context?.solubility),
      biodegradation: new FormArray(context?.biodegradation.map((biodegradationInfo: BiodegradationInfo): FormGroup => this.getBiodegradationFormGroup(biodegradationInfo)) || []),
      applications: new FormControl(context?.applications)
    })
    this.displayedImg = this.form.get('polymerUnitImg')?.value
  }

  public get biodegradationControls(): FormArray {
    return this.form.get('biodegradation') as FormArray;
  }

  public getControls(control: AbstractControl): FormArray {
      const dd = control as FormGroup;
      console.log(dd.get('references'))
      return dd.get('references') as FormArray
  }

  private getFormValue(): Polymer {
    const {imgFile, ...form} = this.form.getRawValue();
    return form as Polymer;
  }

  submit(): void {
    this.context.completeWith(this.getFormValue());
  }

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.imgFileControl.valueChanges.pipe(
    switchMap(file => (file ? this.makeRequest(file) : of(null))),
  );

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.imgFileControl.setValue(null);
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        if (Math.random() > 0.5) {
          return file;
        }

        this.rejectedFiles$.next(file);

        return null;
      }),
      finalize(() => this.loadingFiles$.next(null)),
    );
  }

  public addBiodegradationFormGroup() {
    const biodegradationControl = this.form.get('biodegradation') as FormArray
    biodegradationControl.push(this.getBiodegradationFormGroup())
  }

  public getBiodegradationFormGroup(biodegradationInfo: BiodegradationInfo | null=null): FormGroup {
    return new FormGroup({
      microorganism: new FormControl(biodegradationInfo?.microorganism),
      references: new FormControl(biodegradationInfo?.references),
      comment: new FormControl(biodegradationInfo?.comment)
    })
  }

  public getImg() {
    return `url("data:image/jpg;base64,'${this.form.get('polymerUnitImg')?.value}")`
  }
}
