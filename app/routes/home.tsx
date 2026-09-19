import type { Route } from "./+types/home";

// ponytail: placeholder until the home page feature lands.
export function meta(_: Route.MetaArgs) {
  return [{ title: "La Fenice | Centro Estetico a Novara" }];
}

export default function Home() {
  return (
    <main>
      <h1>La Fenice</h1>
    </main>
  );
}
