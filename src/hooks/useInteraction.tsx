import { useEffect, useState } from "react";

const events = ["mousedown", "touchstart"];

export default function useInteraction() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const listener = () => {
      if (ready === false) {
        setReady(true);
      }
    };

    events.forEach((event) => {
      document.addEventListener(event, listener);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, listener);
      });
    };
  }, [ready]);

  return ready;
}
