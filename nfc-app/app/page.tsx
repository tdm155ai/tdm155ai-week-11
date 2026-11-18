import Link from "next/link";

const APPS = [
  ["red", "bg-red-500"],
  ["orange", "bg-orange-500"],
  ["yellow", "bg-yellow-400"],
  ["green", "bg-green-500"],
  ["blue", "bg-blue-500"],
  ["purple", "bg-purple-500"],
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-widest text-zinc-500">LL week 11</p>
        <h1 className="text-4xl font-semibold tracking-tight">Tap a card.</h1>
      </div>
      <ul className="grid grid-cols-2 gap-3">
        {APPS.map(([name, bg]) => (
          <li key={name}>
            <Link
              href={`/${name}`}
              className={`${bg} block rounded-xl px-4 py-6 text-lg font-medium text-white`}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
