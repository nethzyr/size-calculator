import {
  Input,
  InputGroup,
  InputRightElement,
  Kbd,
  Spinner,
} from "@hope-ui/solid";
import { debounce } from "@solid-primitives/scheduled";
import {
  Component,
  createResource,
  createSignal,
  For,
  Setter,
  Show,
} from "solid-js";
import { HiSolidChevronDown } from "solid-icons/hi";

type Brand = {
  id: string;
  name: string;
};

type Response = {
  brands: Brand[];
  next: string;
};

type Query = {
  prefix: string;
  next: string | undefined;
};

const fetchBrands = (query: Query) =>
  fetch(
    `https://size-calculator-api.sspinc.io/brands?name_prefix=${query.prefix}&next=${query.next}`,
    {
      headers: new Headers({
        Authorization: "Basic " + btoa(import.meta.env.VITE_API_CREDENTIALS),
      }),
    }
  ).then((res) => res.json());

const BrandSelector: Component<{ setBrand: Setter<string> }> = ({
  setBrand,
}) => {
  const [query, setQuery] = createSignal<Query>({ prefix: "", next: "" });
  const [inputValue, setInputValue] = createSignal("");
  const [data] = createResource<Response, Query>(query, fetchBrands);
  const [focused, setFocused] = createSignal(false);
  const [selectedIndex, setSelectedIndex] = createSignal(-1);
  const debounceSetPrefix = debounce(
    (value: string) => setQuery({ ...query(), prefix: value }),
    150
  );
  const keyDownHandler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setQuery({ ...query(), next: data()?.next });
      return;
    }
    if (e.key === "ArrowUp" && selectedIndex() > 0) {
      setSelectedIndex((prev) => prev - 1);
      return;
    }
    if (
      e.key === "ArrowDown" &&
      selectedIndex() + 1 < (data()?.brands.length ?? 0)
    ) {
      setSelectedIndex((prev) => prev + 1);
      return;
    }
    if (e.key === "Enter") {
      const selectedBrand = data()?.brands[selectedIndex()];
      setBrand(selectedBrand?.id ?? "");
      setInputValue(selectedBrand?.name ?? "");
      document.getElementById("category-selector")?.focus();
    }
  };

  return (
    <div class="relative flex flex-col mx-auto w-80">
      <InputGroup>
        <Input
          placeholder="Select a brand"
          onFocus={() => {
            setFocused(true);
            setQuery({ ...query(), next: "" });
          }}
          onBlur={() => setTimeout(() => setFocused(false), 125)}
          onKeyDown={keyDownHandler}
          value={inputValue()}
          onInput={(e) => {
            debounceSetPrefix(e.currentTarget.value);
            setInputValue(e.currentTarget.value);
          }}
        />
        <InputRightElement pointerEvents="none">
          <HiSolidChevronDown />
        </InputRightElement>
      </InputGroup>
      <Show when={focused()}>
        <div class="absolute bg-white flex top-[42px] w-full flex-col z-10 border">
          <Show
            when={!data.loading}
            fallback={
              <div class="flex justify-center">
                <Spinner />
              </div>
            }
          >
            <For each={data()?.brands} fallback={<div>No results</div>}>
              {(item, index) => (
                <button
                  class={`hover:cursor-pointer hover:bg-gray-200 p-1 text-sm ${
                    selectedIndex() === index() && "bg-gray-200"
                  }`}
                  onClick={() => {
                    setInputValue(item.name);
                    setBrand(item.id);
                  }}
                >
                  <span class="text-center">{item.name}</span>
                </button>
              )}
            </For>
          </Show>
          <Show when={data()?.next}>
            <div class="text-gray-400 text-xs text-center p-1">
              Press <Kbd>CTRL</Kbd> + <Kbd>K</Kbd> to load next page
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export default BrandSelector;
