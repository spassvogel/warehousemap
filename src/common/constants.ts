export interface ISituations {
  [name: string]: ISituation
}
  
export interface ISituation {
  header: string;
  description: string;
  options: string[];
}