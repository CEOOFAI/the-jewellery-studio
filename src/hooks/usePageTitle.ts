import { useEffect } from "react";

const BASE = "The Jewellery Studio";

export default function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : `${BASE} | Fine Jewellery & Pawnbrokers | Gibraltar`;
  }, [title]);
}
