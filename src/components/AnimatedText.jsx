const AnimatedText = ({
  text,
  className = "",
  animateIn = false,
  animateOut = false,
  delay = 0,
  marginLeft,
  staggerDelay = 0.08,
}) => {
  const words = text.split(" ");

  return (
    <div className={`overflow-hidden ${className} `}>
      {words.map((word, index) => (
        <span
          key={`${text}-${index}-${
            animateIn ? "in" : animateOut ? "out" : "static"
          }`}
          className={`inline-block  mr-1 ${
            animateIn
              ? "animate-[wordFadeInUp_0.8s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
              : animateOut
              ? "animate-[wordFadeOutUp_0.6s_cubic-bezier(0.55,0.06,0.68,0.19)_forwards]"
              : ""
          }
          ${marginLeft ? marginLeft : ""}
          `}
          style={{
            animationDelay: animateIn
              ? `${delay + index * staggerDelay}s`
              : animateOut
              ? `${index * 0.04}s`
              : "0s",
            opacity: animateIn ? 0 : 1,
            transform: animateIn ? "translateY(30px)" : "translateY(0px)",
            transition: "none",
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};
export default AnimatedText;
