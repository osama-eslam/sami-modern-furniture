/**
 * Branded intro — pure CSS, ~1s, first visit per session only, pointer-events
 * none so it never blocks interaction. Disabled for reduced-motion users.
 */
export function Loader() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('sm.seen'))document.documentElement.classList.add('sm-seen');else sessionStorage.setItem('sm.seen','1')}catch(e){}`,
        }}
      />
      <div className="loader" aria-hidden>
        <div className="flex w-60 flex-col items-center gap-5" dir="ltr">
          <span className="font-latin text-sm font-medium tracking-[0.5em]" style={{ animation: "fade-in .6s ease both" }}>
            SAMY MODERN
          </span>
          <span className="block h-px w-full bg-ivory/15">
            <span className="loader-bar block h-px w-full bg-ivory" />
          </span>
        </div>
      </div>
    </>
  );
}
