import { Connection } from "mongoose";

declare global {
  var mongoose: {
    cnn: Connection | null;
    promise: Promise<Connection> | null;
  };
}
export {};
