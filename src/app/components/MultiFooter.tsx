"use client";

export default function MultiFooter() {
  return (
    <footer className="flex z-30 bg-lader text-lax text-lg font-medium font-visual leading-tight w-full flex-col items-center justify-center lg:items-start lg:justify-start min-h-[75vh]">
      <div className="flex flex-col items-center justify-center lg:justify-start lg:items-start px-4 pt-8 h-full">
        <svg
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-24 h-24 mb-4"
        >
          <rect width="300" height="300" className="fill-lax" />
          <path
            d="M67 240V58H107.584L144.24 141.98C145.811 145.62 147.382 147.44 150 147.44C153.142 147.44 154.451 146.14 156.284 141.98L192.678 58H233V240H203.937V107.92H193.726V128.2H183.514V157.84H173.303V178.12H126.697V157.84H116.486V128.2H106.274V107.92H96.0631V240H67Z"
            className="fill-lader"
          />
        </svg>

        <p className="text-center">
          Copyright Multi² 2026. All rights reserved.
        </p>

        <div className="text-center flex items-baseline gap-x-1 uppercase">
          We multiply what matters
          <span>
            <svg
              viewBox="0 0 300 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
            >
              <rect
                width="300"
                height="300"
                transform="matrix(-1 0 0 1 300 0)"
                className="fill-lax"
              />
              <path
                d="M112 111V30H94.153L78.0331 67.3757C77.3423 68.9957 76.6514 69.8057 75.5 69.8057C74.1183 69.8057 73.5426 69.2271 72.7366 67.3757L56.7319 30H39V111H51.7808V52.2171H56.2713V61.2429H60.7618V74.4343H65.2524V83.46H85.7476V74.4343H90.2382V61.2429H94.7287V52.2171H99.2192V111H112Z"
                className="fill-lader"
              />
            </svg>
          </span>
        </div>

        <p className=" text-center ">Multi² is pronounced "Multisquared"</p>
      </div>
    </footer>
  );
}
