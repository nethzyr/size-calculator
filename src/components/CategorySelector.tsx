import { Input, InputGroup, InputRightElement, Spinner } from "@hope-ui/solid";
import { HiSolidChevronDown } from "solid-icons/hi";
import {
  Accessor,
  Component,
  createResource,
  createSignal,
  For,
  Setter,
  Show,
} from "solid-js";

type Category = {
  id: string;
  name: string;
};

type Response = {
  brandId: string;
  categories: Category[];
};

const fetchCategories = (brand: string) =>
  fetch(`https://size-calculator-api.sspinc.io/categories?brand_id=${brand}`, {
    headers: new Headers({
      Authorization: "Basic " + btoa(import.meta.env.VITE_API_CREDENTIALS),
    }),
  }).then((res) => res.json());

const CategorySelector: Component<{
  brand: Accessor<string | undefined>;
  setCategory: Setter<string>;
}> = ({ brand, setCategory }) => {
  const [inputValue, setInputValue] = createSignal("");
  const [data] = createResource<Response, string>(brand, fetchCategories);
  const [focused, setFocused] = createSignal(false);
  const [selectedIndex, setSelectedIndex] = createSignal(-1);
  const keyDownHandler = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key === "ArrowUp" && selectedIndex() > 0) {
      setSelectedIndex((prev) => prev - 1);
      return;
    }
    if (
      e.key === "ArrowDown" &&
      selectedIndex() + 1 < (data()?.categories.length ?? 0)
    ) {
      setSelectedIndex((prev) => prev + 1);
      return;
    }
    if (e.key === "Enter") {
      const selectedCategory = data()?.categories[selectedIndex()];
      setCategory(selectedCategory?.id ?? "");
      setInputValue(selectedCategory?.name ?? "");
      document.getElementById("size-input")?.focus();
    }
  };

  return (
    <div class="relative mx-auto flex w-80 flex-col">
      <InputGroup>
        <Input
          id="category-selector"
          placeholder="Select a category"
          disabled={!brand()}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 125)}
          onKeyDown={keyDownHandler}
          value={inputValue()}
        />
        <InputRightElement pointerEvents="none">
          <HiSolidChevronDown />
        </InputRightElement>
      </InputGroup>
      <Show when={focused()}>
        <div class="absolute top-[42px] z-10 flex w-full flex-col border bg-white">
          <Show
            when={!data.loading}
            fallback={
              <div class="flex justify-center">
                <Spinner />
              </div>
            }
          >
            <For each={data()?.categories} fallback={<div>No results</div>}>
              {(item, index) => (
                <button
                  class={`p-1 text-sm hover:cursor-pointer hover:bg-gray-200 ${
                    selectedIndex() === index() && "bg-gray-200"
                  }`}
                  onClick={() => {
                    setInputValue(item.name);
                    setCategory(item.id);
                  }}
                >
                  <span class="text-center">{item.name}</span>
                </button>
              )}
            </For>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export default CategorySelector;
