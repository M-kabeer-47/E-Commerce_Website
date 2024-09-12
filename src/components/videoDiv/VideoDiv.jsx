import React from "react";
import "./styles.css";

export default function VideoDiv() {
  return (
    <div className="videoDiv">
      <div className="textDiv">
        <h2>Discover Next-Gen Gaming with PS5</h2>
        <p>
          Step into the next generation of gaming with the PlayStation 5. Enjoy
          breathtaking graphics, lightning-fast load times, and immersive
          gameplay like never before. The PS5's innovative DualSense controller
          brings you closer to the action, with haptic feedback and adaptive
          triggers that respond to your every move.
        </p>
      </div>

      <div className="video">
        <video className="ps5Video" autoPlay muted loop src="/ps5.mp4" />
      </div>
    </div>
  );
}
