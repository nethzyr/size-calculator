import { Input } from "@hope-ui/solid";
import { Accessor, Component, Setter } from "solid-js";

const SizeInput: Component<{
  size: Accessor<string>;
  setSize: Setter<string>;
  navigateToResultPage: () => void;
}> = ({ size, setSize, navigateToResultPage }) => {
  return (
    <div class="flex items-center justify-center gap-1">
      <span>My size is</span>
      <Input
        id="size-input"
        class="w-auto"
        type="number"
        value={size()}
        onInput={(e) => setSize(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            navigateToResultPage();
          }
        }}
      />
      <span>inches.</span>
    </div>
  );
};

export default SizeInput;
