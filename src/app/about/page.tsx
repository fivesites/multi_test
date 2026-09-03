"use client";

import AboutSectionText from "@/app/components/AboutSectionText";
import { useCopyEntry, useCopyBody } from "@/context/CopyContext";

export default function AboutPage() {
  const aboutEntry = useCopyEntry("about-intro");
  const aboutBody = useCopyBody("about-intro");

  return (
    <div className="min-h-screen ">
      <div className="relative grid grid-cols-12 h-dvh w-full"></div>

      <AboutSectionText
        plainText={aboutEntry?.plainText ?? ""}
        text={aboutBody ?? undefined}
      />
      {/* <svg
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_77_497)">
            <rect width="600" height="600" fill="white" />
            <path d="M600 0H0V600H600V0ZM24 24H576V576H24V24Z" fill="#F70000" />
            <path
              d="M576 24H24V576H576V24ZM48 48H552V552H48V48Z"
              fill="white"
            />
            <path
              d="M552 48H48V552H552V48ZM72 72H528V528H72V72Z"
              fill="#F70000"
            />
            <path
              d="M528 72H72V528H528V72ZM96 96H504V504H96V96Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M96 96H504V504H96V96ZM120 120H480V480H120V120Z"
              fill="#F70000"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M480 120H120V480H480V120ZM144 144H456V456H144V144Z"
              fill="white"
            />
            <path
              d="M456 144H144V456H456V144ZM168 168H432V432H168V168Z"
              fill="#F70000"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M168 168H432V432H168V168ZM192 192H408V408H192V192Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M408 192H192V408H408V192ZM216 216H384V384H216V216Z"
              fill="#F70000"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M216 216H384V384H216V216ZM240 240H360V360H240V240Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M240 240H360V360H240V240ZM264 264H336V336H264V264Z"
              fill="#F70000"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M336 264H264V336H336V264ZM288 288H312V312H288V288Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M288 288H312V312H288V288Z"
              fill="#F70000"
            />
          </g>
          <defs>
            <clipPath id="clip0_77_497">
              <rect width="600" height="600" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <svg
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_77_497)">
            <rect width="600" height="600" fill="white" />
            <path d="M600 0H0V600H600V0ZM24 24H576V576H24V24Z" fill="#F70000" />
            <path
              d="M576 24H24V576H576V24ZM48 48H552V552H48V48Z"
              fill="white"
            />
            <path
              d="M552 48H48V552H552V48ZM72 72H528V528H72V72Z"
              fill="#F70000"
            />
            <path
              d="M528 72H72V528H528V72ZM96 96H504V504H96V96Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M96 96H504V504H96V96ZM120 120H480V480H120V120Z"
              fill="#F70000"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M480 120H120V480H480V120ZM144 144H456V456H144V144Z"
              fill="white"
            />
            <path
              d="M456 144H144V456H456V144ZM168 168H432V432H168V168Z"
              fill="#F70000"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M168 168H432V432H168V168ZM192 192H408V408H192V192Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M408 192H192V408H408V192ZM216 216H384V384H216V216Z"
              fill="#F70000"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M216 216H384V384H216V216ZM240 240H360V360H240V240Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M240 240H360V360H240V240ZM264 264H336V336H264V264Z"
              fill="#F70000"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M336 264H264V336H336V264ZM288 288H312V312H288V288Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M288 288H312V312H288V288Z"
              fill="#F70000"
            />
          </g>
          <defs>
            <clipPath id="clip0_77_497">
              <rect width="600" height="600" fill="white" />
            </clipPath>
          </defs>
        </svg> */}
    </div>
  );
}
