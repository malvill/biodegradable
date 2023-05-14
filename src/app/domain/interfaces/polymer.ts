import {BiodegradationInfo} from "./biodegradation-info";

export interface Polymer {
  id: string,
  name: string,
  iupacName: string,
  polymerUnitImg: string,
  production: string,
  toxicity: string,
  properties: string,
  solubility: string
  biodegradation: BiodegradationInfo[],
  applications: string
}
