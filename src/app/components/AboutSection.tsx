import HeroText from "./HeroText";

const ABOUT_TEXT =
  "Multi2 is a creative design studio based in Stockholm built on a simple idea: multiplication beats addition. Multi2 works across branding, digital design, creative direction, visual systems and interactive experiences — always with the same goal: to multiply what matters. Because the best ideas are rarely linear.  ";

export default function AboutSection() {
  return (
    <section className="min-h-screen  px-4 lg:px-8 snap-start flex flex-col items-center justify-center bg-primary gap-3">
      <div
        id="about-text"
        className="h-full flex flex-col items-center justify-center gap-3 "
      >
        <HeroText
          className="text-foreground text-4xl lg:text-5xl max-w-md lg:max-w-5xl leading-tight text-center"
          texts={[ABOUT_TEXT]}
        />
      </div>
    </section>
  );
}
