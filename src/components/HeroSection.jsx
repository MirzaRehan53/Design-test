import { useEffect, useRef, useState } from "react";

// AnimatedText component
const AnimatedText = ({
  text,
  animateIn,
  animateOut,
  delay = 0,
  staggerDelay = 0.1,
}) => {
  const words = text.split(" ");

  return (
    <span className="inline-block">
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block mr-2 ${
            animateOut
              ? "animate-fade-out-up"
              : animateIn
              ? "animate-fade-in-up"
              : "opacity-0"
          }`}
          style={{
            animationDelay: `${delay + index * staggerDelay}s`,
            animationFillMode: "both",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

const HeroSection = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [textAnimateIn, setTextAnimateIn] = useState(false);
  const [textAnimateOut, setTextAnimateOut] = useState(false);

  const progressIntervalRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const images = [
    "/assets/corps.webp",
    "/assets/sunshine.webp",
    "/assets/family.webp",
    "/assets/sunshine.webp",
  ];

  const slideTexts = [
    {
      welcome: "Welcome To TenTwenty Farms",
      title: "From Our Farms To Your Hands",
    },
    { welcome: "Discover Excellence", title: "Urban Innovation" },
    { welcome: "Experience Design", title: "Future Living" },
    { welcome: "Explore Possibilities", title: "Sustainable Future" },
  ];

  // Helper functions to get current and next indices
  const getCurrentIndex = () => slideIndex;
  const getNextIndex = () => (slideIndex + 1) % images.length;

  // Initial text animation - trigger immediately on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setTextAnimateIn(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Preload next image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = images[getNextIndex()];
  }, [slideIndex]);

  // Simple progress timer that runs independently
  useEffect(() => {
    if (isTransitioning) return;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100; // Cap at 100, don't reset here
        }
        return prev + 0.7;
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isTransitioning, slideIndex]); // Restart when slide changes or transition ends

  // Watch for progress completion and trigger transition
  useEffect(() => {
    if (progress >= 100 && !isTransitioning) {
      goToNextSlide();
    }
  }, [progress, isTransitioning]);

  const goToNextSlide = () => {
    if (isTransitioning) return;

    // Clear progress timer
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Start text exit animation
    setTextAnimateOut(true);
    setTextAnimateIn(false);
    setIsTransitioning(true);

    // Start transition
    transitionTimeoutRef.current = setTimeout(() => {
      // Move to next slide
      setSlideIndex((prev) => (prev + 1) % images.length);
      setAnimationKey((prev) => prev + 1);
      setImageLoaded(true);

      // Reset text animation states
      setTextAnimateOut(false);

      // Start text enter animation with a slight delay
      setTimeout(() => {
        setTextAnimateIn(true);
      }, 200);

      // Reset progress and end transition
      setProgress(0);
      setIsTransitioning(false);
    }, 2300);
  };

  const handlePreviewClick = () => {
    if (!isTransitioning) {
      goToNextSlide();
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const svgSize = isMobile ? 115 : 135;
  const strokeWidth = 10;
  const pathInnerSize = svgSize - strokeWidth;
  const pathOffset = strokeWidth / 2;

  const svgPathD = `M ${pathOffset + pathInnerSize / 2} ${pathOffset}
L ${pathOffset + pathInnerSize} ${pathOffset}
L ${pathOffset + pathInnerSize} ${pathOffset + pathInnerSize}
L ${pathOffset} ${pathOffset + pathInnerSize}
L ${pathOffset} ${pathOffset}
L ${pathOffset + pathInnerSize / 2} ${pathOffset}`;
  const strokePerimeter = 4 * pathInnerSize;

  const currentIndex = getCurrentIndex();
  const nextIndex = getNextIndex();

  return (
    <div className="relative h-screen overflow-hidden">
      <style jsx>{`
        @keyframes expand-vertical-from-center {
          0% {
            clip-path: polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%);
          }
          100% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
          }
        }
        .animate-expand-vertical-from-center {
          animation: expand-vertical-from-center 2s ease-out forwards;
        }

        @keyframes wordFadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }

        @keyframes wordFadeOutUp {
          0% {
            opacity: 1;
            transform: translateY(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px);
          }
        }

        .animate-fade-in-up {
          animation: wordFadeInUp 0.6s ease-out forwards;
        }

        .animate-fade-out-up {
          animation: wordFadeOutUp 0.4s ease-in forwards;
        }
      `}</style>

      <div className="absolute inset-0">
        <div className="absolute inset-0 z-10">
          <div
            className={`w-full h-full bg-cover bg-center transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-90"
            }`}
            style={{
              backgroundImage: `url(${images[currentIndex]})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
        </div>

        {isTransitioning && (
          <div className="absolute inset-0 z-20">
            <div
              key={`transition-${animationKey}`}
              className="w-full h-full bg-cover bg-center animate-expand-vertical-from-center"
              style={{
                backgroundImage: `url(${images[nextIndex]})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          </div>
        )}
      </div>

      <div className="absolute z-40 flex items-center justify-center h-full left-[25px] md:left-[135px]">
        <div className="max-w-4xl">
          <p className="text-[#EEF4F9] leading-[150%] text-[14px] sm:text-base font-medium mb-4">
            <AnimatedText
              text={slideTexts[currentIndex].welcome}
              animateIn={textAnimateIn}
              animateOut={textAnimateOut}
              delay={0}
              staggerDelay={0.08}
            />
          </p>
          <h1 className="text-white sm:text-[52px] text-[46px] max-sm:max-w-[341px] md:text-[64px] font-normal leading-[100%] capitalize">
            <AnimatedText
              text={slideTexts[currentIndex].title}
              animateIn={textAnimateIn}
              animateOut={textAnimateOut}
              delay={0.3}
              staggerDelay={0.1}
            />
          </h1>
        </div>
      </div>

      <div className="absolute bottom-[80px] left-[25px] md:left-[135px] z-40">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-start space-y-3">
            <button
              onClick={handlePreviewClick}
              className="relative block focus:outline-none group"
              disabled={isTransitioning}
            >
              <svg
                className={`absolute w-[${svgSize}px] h-[${svgSize}px]`}
                viewBox={`0 0 ${svgSize} ${svgSize}`}
              >
                <rect
                  x={pathOffset}
                  y={pathOffset}
                  width={pathInnerSize}
                  height={pathInnerSize}
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                />

                <path
                  d={svgPathD}
                  fill="none"
                  stroke="white"
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokePerimeter}
                  strokeDashoffset={
                    strokePerimeter - (strokePerimeter * progress) / 100
                  }
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  className="transition-all duration-100 ease-linear"
                />
              </svg>
              <div className="md:!w-[135px] !w-[115px] !h-[115px] md:!h-[135px] overflow-hidden relative m-2 flex items-center justify-center">
                <div
                  className={`md:w-[93px] w-[73px] hover:scale-105 transition-all ease-in-out duration-200 h-[73px] md:h-[93px] bg-center bg-cover ${
                    isTransitioning ? "animate-expand-vertical-from-center" : ""
                  }`}
                  style={{
                    backgroundImage: `url(${images[nextIndex]})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <div className="text-white absolute leading-[110px] tracking-[0px] font-normal w-full h-full flex items-center top-0 justify-center text-base pointer-events-none">
                  Next
                </div>
              </div>
            </button>
          </div>

          <div className="text-white text-sm font-medium flex items-center space-x-3">
            <span>{String(currentIndex + 1).padStart(2, "0")}</span>
            <div className="w-[100px] md:w-[103px] border-[1px] bg-[#EEF4F9]"></div>
            <span>{String(images.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
