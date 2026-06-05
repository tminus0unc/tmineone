"use client";

type Props = {
  targetId: string;
};

export default function ScrollDownButton({ targetId }: Props) {
  const scrollDown = () => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="pb-8 flex justify-center">
      <button
        onClick={scrollDown}
        className="
                absolute
                bottom-10 right-6
                md:bottom-10 md:right-auto md:left-1/2 md:-translate-x-1/2
                text-foreground transition-opacity duration-300 hover:opacity-50
            "
      >
        {/* Mobile: small mono label in corner */}
        <p className="md:hidden font-mono text-[30px] tracking-[0.3em] uppercase text-foreground">
          ⌄
        </p>

        {/* Desktop: bouncing caret centered */}
        <p className="hidden md:block text-[4vh] animate-bounce [animation-duration:3s]">
          ⌄
        </p>
      </button>
    </div>
  );
}
