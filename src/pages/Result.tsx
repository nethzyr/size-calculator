import { Button, Spinner } from "@hope-ui/solid";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { Component, createResource, For, Show } from "solid-js";

type Params = {
  brand: string;
  category: string;
  size: string;
};

type Response = {
  sizes: { label: string }[];
};

const fetchResult = ({ brand, category, size }: Params) => {
  return fetch(
    `https://size-calculator-api.sspinc.io/sizes?brand_id=${brand}&category_id=${category}&measurement=${size}`,
    {
      headers: new Headers({
        Authorization: "Basic " + btoa(import.meta.env.VITE_API_CREDENTIALS),
      }),
    }
  ).then((res) => res.json());
};

const Result: Component = () => {
  // TODO: navigate back instead of home when we have query params
  // TODO: check if given size is in correct range before submitting
  const navigate = useNavigate();
  const [searchParams] = useSearchParams<Params>();
  const [data] = createResource<Response, Params>(
    () => searchParams,
    fetchResult
  );

  return (
    <main>
      <div class="text-center font-semibold">Your size is</div>
      <div class="text-center text-4xl font-bold">
        <Show when={!data.loading} fallback={<Spinner />}>
          <For
            each={data()?.sizes}
            fallback={<div>No results for this size</div>}
          >
            {(item, index) => (
              <>
                {item.label}
                {(data()?.sizes.length ?? 0) - 1 > index() && " OR "}
              </>
            )}
          </For>
        </Show>
      </div>
      <div class="p-4"></div>
      <div class="flex justify-center">
        <Button class="w-40 bg-violet-700" onClick={() => navigate("/")}>
          OK
        </Button>
      </div>
    </main>
  );
};

export default Result;
