import { Shell } from "lucide-react-native";
import { registerPlugin } from "../../registry";
import BrainrotPanel from "./Panel";

registerPlugin({
  id: "brainrot",
  name: "Brainrot",
  type: "extra",
  icon: Shell,
  component: BrainrotPanel,
  defaultTitle: "Brainrot",
  allowMultipleInstances: false,
});

export { BrainrotPanel };
