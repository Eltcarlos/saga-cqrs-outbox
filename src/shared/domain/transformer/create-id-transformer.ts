import { ValueTransformer } from "typeorm";
import { BaseId } from "../value-object/BaseId";

export function createIdTransformer<T extends string, ID extends BaseId<T>>(
  IdClass: new (value: T) => ID
): ValueTransformer {
  return {
    to(value: ID): T {
      return value.getValue();
    },
    from(value: T): ID {
      return new IdClass(value);
    },
  };
}
