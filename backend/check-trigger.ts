import * as trigger from "@trigger.dev/sdk/v3";
console.log(Object.keys(trigger));
if (trigger.runs) {
  console.log("runs keys:", Object.keys(trigger.runs));
}
