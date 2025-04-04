// app/loader.js
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Spinner from "components/Spinner"; // or adjust path accordingly

const Loader = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); // change this based on expected load time

    return () => clearTimeout(timer);
  }, [pathname]);

  return loading ? <Spinner /> : null;
};

export default Loader;
