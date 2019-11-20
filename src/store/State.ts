import { observable } from "mobx";

export class Store {
    @observable
    public state: "pending" | "done" | "error" = "pending";
}
