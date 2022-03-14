import { Accessor } from "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      accordian: [() => Accessor<boolean>, (v: any) => any];
    }
  }
}
