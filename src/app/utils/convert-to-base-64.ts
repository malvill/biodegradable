import {Observable, Subject} from "rxjs";

export const convertFileToBase64 = (file: File): Observable<string> => {
  const result$: Subject<string> = new Subject<string>();
  const fileReader: FileReader = new FileReader();

  fileReader.readAsDataURL(file);

  fileReader.onload = (): void => {
    result$.next(fileReader.result!.toString());
    result$.complete();
  };

  return result$;
};
