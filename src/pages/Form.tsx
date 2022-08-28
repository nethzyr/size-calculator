import { Button } from "@hope-ui/solid";
import { useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import BrandSelector from "../components/BrandSelector";
import CategorySelector from "../components/CategorySelector";
import SizeInput from "../components/SizeInput";

const Form: Component = () => {
  // TODO: use different state management to handle e.g query params
  const navigate = useNavigate();
  const [brand, setBrand] = createSignal<string>();
  const [category, setCategory] = createSignal<string>();
  const [size, setSize] = createSignal<string>("");
  const navigateToResultPage = () =>
    navigate(`/result?brand=${brand()}&category=${category()}&size=${size()}`);

  return (
    <main class="flex flex-col gap-2">
      <BrandSelector setBrand={setBrand} />
      <CategorySelector brand={brand} setCategory={setCategory} />
      <SizeInput
        size={size}
        setSize={setSize}
        navigateToResultPage={navigateToResultPage}
      />
      <div class="p-1"></div>
      <div class="flex justify-center">
        <Button
          class="w-40 bg-violet-700"
          disabled={!brand() || !category() || !size()}
          onClick={navigateToResultPage}
        >
          Calculate
        </Button>
      </div>
    </main>
  );
};

export default Form;
