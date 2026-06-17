"use client";

import { useEffect, useRef } from "react";

export default function FlipBook() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Inject the anchor tag dynamically
        containerRef.current.innerHTML = `
      <a 
        href="https://online.flippingbook.com/view/232999240/"
        class="fbo-embed"
        data-fbo-id="68c1d639e5"
        data-fbo-ratio="3:2"
        data-fbo-lightbox="yes"
        data-fbo-width="100%"
        data-fbo-height="auto"
        data-fbo-version="1"
        style="max-width:100%;width:100%;display:block;"
      >Sponsorship Package</a>
    `;

        const script = document.createElement("script");
        script.src = "https://online.flippingbook.com/EmbedScriptUrl.aspx?m=redir&hid=232999240";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return <div ref={containerRef} className="w-full h-full" />;
}