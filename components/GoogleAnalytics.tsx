"use client";

import Script from "next/script";

const GA_ID = "G-2LT04HNKZK";

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />

      <Script
        id="google-analytics"
        strategy="lazyOnload"
      >
        {`
          window.dataLayer = window.dataLayer || [];

          function gtag() {
            window.dataLayer.push(arguments);
          }

          gtag("js", new Date());
          gtag("config", "${GA_ID}");
        `}
      </Script>
    </>
  );
}