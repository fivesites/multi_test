import Link from "next/link";

export default function OverlayHeroText({ text }: { text: string }) {
  const headingClass =
    "sticky lg:relative top-[82vh] lg:top-auto z-20 font-visual text-6xl lg:text-9xl  text-lava hover:text-liguriskt uppercase leading-none  text-center lg:text-left font-normal tracking-tight lg:tracking-tighter lg:leading-[0.9] ";

  return (
    <div className="h-dvh flex flex-col items-center justify-start lg:items-start px-4 lg:px-8 ">
      <h1 className={headingClass}>We multiply what matters</h1>
      {text && (
        <p className="z-10 font-visual text-2xl lg:text-3xl tracking-wide max-w-5xl font-medium  leading-[1.1] text-liguriskt mt-4 text-center lg:text-left lg:tracking-normal lg:font-normal lg:indent-16 lg:mt-2 ">
          {text}
        </p>
      )}
      <span className=""></span>
      <Link
        href="mailto:hello@multi2.co"
        className="pointer-events-auto font-visual text-2xl lg:text-3xl w-full font-medium leading-[1] text-lava mt-18 flex justify-between hover:bg-red-300 hover:text-red-100 lg:mt-2 hover:px-2 lg:max-w-5xl"
      >
        {"connect with us".split("").map((char, i) => (
          <span key={i}>{char === " " ? " " : char}</span>
        ))}
      </Link>
    </div>
  );
}
