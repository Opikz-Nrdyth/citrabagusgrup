import { useEffect, useState } from "react";
import "../Style/loader.css";
const Loader = () => {
  const [loading, setLoading] = useState("Loading");
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (dots < 3) {
        setDots(dots + 1);
        setLoading(loading + ".");
      } else {
        setDots(0);
        setLoading("Loading");
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [loading, dots]);

  return (
    <div className="bg-spinner position-fixed top-0 start-0 z-3">
      <div className="position-fixed start-50 top-50 translate-middle">
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="position-fixed start-50 top-50 translate-middle pt-5 mt-3">
        <p className="text-white pt-5 fw-bolder fs-5">{loading}</p>
      </div>
    </div>
  );
};

export default Loader;
