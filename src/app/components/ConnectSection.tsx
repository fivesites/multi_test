"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CheckButton from "./CheckButton";
import LandningBlock from "./LandningBlock";
import { Reveal } from "./Reveal";
import TypedHeading from "./TypedHeading";

const HEADING = "lets start talking today";

const LINKS = [
  { label: "email", href: "mailto:info@multi2.co" },
  { label: "Instagram", href: "#" },
  { label: "Linkedin", href: "#" },
] as const;

/** The same people as the footer — shown from `lg` up, Adam at col 4, Daniel
 *  at col 7. */
const CONTACTS = [
  {
    name: "Adam Odelfelt",
    phone: "+46704952184",
    email: "adam@multi2.co",
    col: "lg:col-start-4 lg:col-span-2",
  },
  {
    name: "Daniel von Malmborg",
    phone: "+46704952184",
    email: "daniel@multi2.co",
    col: "lg:col-start-7 lg:col-span-2",
  },
] as const;

const LINK_BTN =
  "flex items-center h-auto py-0 gap-x-1.5 font-thin justify-start whitespace-nowrap w-min";

/**
 * The "connect with us" block — one full-width 12-col grid, `items-baseline` so
 * the label and the typed heading share a baseline on the first row, then the
 * general links (col 1) and the per-person contacts (cols 4 / 7, `lg`+) on the
 * next. Used on the home page and the connect page.
 */
export default function ConnectSection({ className }: { className?: string }) {
  return (
    <Reveal className="grid grid-cols-3 lg:grid-cols-12 gap-x-3 h-dvh">
      <LandningBlock
        bg=" text-primary"
        className={cn(
          "col-span-3 lg:col-start-1 lg:col-span-12 h-auto w-full pb-6",
          className,
        )}
        contentClassName="col-start-1 col-span-3 lg:col-start-1 lg:col-span-12 lowercase grid grid-cols-3 lg:grid-cols-12 items-baseline gap-y-6 lg:pb-12 px-6 lg:px-0"
      >
        <CheckButton
          label="connect with us"
          href="/connect"
          size="lg"
          active
          className="col-span-3 lg:col-start-1 lg:col-span-3"
        />
        <TypedHeading
          text={HEADING}
          className="col-span-3 lg:col-start-4 lg:col-span-9 h2Text font-thin text-primary"
        />

        {/* Col 1 — the general links, one column. */}
        <div className="col-span-3 lg:col-start-1 lg:col-span-3 flex flex-col items-start gap-y-1 lg:pl-3">
          {LINKS.map((link) => (
            <Button
              key={link.label}
              variant="link"
              size="lgLink"
              className={LINK_BTN}
              asChild
            >
              <a
                href={link.href}
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {link.label}
              </a>
            </Button>
          ))}
        </div>

        {/* Cols 4 / 7 — name, phone and email per person. Desktop only. */}
        {CONTACTS.map((contact) => (
          <div
            key={contact.name}
            className={cn(
              "hidden lg:flex flex-col items-start gap-y-1 pl-3",
              contact.col,
            )}
          >
            <Button variant="link" size="lgLink" className={LINK_BTN}>
              {contact.name}
            </Button>
            <Button variant="link" size="lgLink" className={LINK_BTN} asChild>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                {contact.phone}
              </a>
            </Button>
            <Button variant="link" size="lgLink" className={LINK_BTN} asChild>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </Button>
          </div>
        ))}
      </LandningBlock>
    </Reveal>
  );
}
