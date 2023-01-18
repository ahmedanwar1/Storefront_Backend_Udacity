export default interface IStore<RETURNTYPE, OBJ> {
  index(): Promise<RETURNTYPE[]>;
  show(id: number | string): Promise<RETURNTYPE>;
  create(obj: OBJ): Promise<RETURNTYPE>;
}
