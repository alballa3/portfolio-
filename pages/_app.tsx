import { CustomCursor, MouseFollowEffect } from "@/components/pages/index/custom-cursor";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <>
  <MouseFollowEffect/>
  <CustomCursor/>
  <Component {...pageProps} />
  </>;
}
