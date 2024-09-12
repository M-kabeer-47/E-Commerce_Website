
import React, { useState, useEffect } from 'react';


const TypingTextAnimation = () => {
  const [text, setText] = useState('');
  const texts = [
    "Unlock the Ultimate Gaming Experience!",
    "Gear Up for Victory with Our Top Picks!",
    "Unleash Your Gaming Potential with Us!"
  ];
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(true);

  const typingSpeed = 100; // Speed of typing effect (ms per char)
  const eraseSpeed = 50; // Speed of erasing effect (ms per char)
  const pauseDuration = 1000; // Pause duration before switching text (ms)

  useEffect(() => {
    let timeoutId;

    if (typing) {
      if (charIndex < texts[textIndex].length) {
        timeoutId = setTimeout(() => {
          setText((prev) => prev + texts[textIndex][charIndex]);
          setCharIndex((prev) => prev + 1);
        }, typingSpeed);
      } else {
        timeoutId = setTimeout(() => {
          setTyping(false);
        }, pauseDuration);
      }
    } else {
      if (charIndex > 0) {
        timeoutId = setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        }, eraseSpeed);
      } else {
        setTyping(true);
        setTextIndex((prev) => (prev + 1) % texts.length);
        timeoutId = setTimeout(() => {}, pauseDuration); // Small delay before typing starts again
      }
    }

    return () => clearTimeout(timeoutId);
  }, [text, charIndex, typing, textIndex]);

  return (
    <div className="typingContainer" >
      <span className="text first-text"></span>
      <span className="text sec-text">{text}</span>
    </div>
  );
};

export default TypingTextAnimation;
