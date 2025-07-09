import { useState, useEffect, useRef, useCallback } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import AnimatedText from "./AnimatedText";

const QualityProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(5);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animateTextIn, setAnimateTextIn] = useState(false);
  const [animateTextOut, setAnimateTextOut] = useState(false);
  const [titleRef, isTitleVisible] = useIntersectionObserver(0.3);
  const [hasTitleAnimated, setHasTitleAnimated] = useState(false);
  const isResetting = useRef(false);
  const prevCardRef = useRef(null);
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

  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentTranslateX = useRef(0);

  const originalCards = [
    {
      id: 1,
      image: "/assets/bucket-girl.webp",
      title: "Garden Paradise",
      description: "Beautiful garden with lush greenery",
      clientName: "Client A",
      location: "New York, USA",
    },
    {
      id: 2,
      image: "/assets/flowerGirl.webp",
      title: "Flower Fields",
      description: "Vibrant yellow flower fields",
      clientName: "Client B",
      location: "Paris, France",
    },
    {
      id: 3,
      image: "/assets/flowers.webp",
      title: "Greenhouse",
      description: "Modern greenhouse facility",
      clientName: "Client C",
      location: "London, UK",
    },
    {
      id: 4,
      image: "/assets/head-flower-girl-2.webp",
      title: "Botanical Garden",
      description: "Exotic plants and flowers",
      clientName: "Client D",
      location: "Tokyo, Japan",
    },
    {
      id: 5,
      image: "/assets/head-flower-girl.webp",
      title: "Herb Garden",
      description: "Fresh herbs and vegetables",
      clientName: "Client E",
      location: "Dubai, United Arab Emirates",
    },
  ];

  const cards = [
    ...originalCards,
    ...originalCards,
    ...originalCards,
    ...originalCards,
    ...originalCards,
  ];

  // Animate title when it comes into view
  useEffect(() => {
    if (isTitleVisible && !hasTitleAnimated) {
      setHasTitleAnimated(true);
    }
  }, [isTitleVisible, hasTitleAnimated]);

  const performSlide = useCallback(
    (newIndex) => {
      if (isAnimating || isResetting.current) return;

      // Start exit animation
      setAnimateTextIn(false);
      setAnimateTextOut(true);
      setIsAnimating(true);

      // Store previous card for exit animation
      prevCardRef.current = cards[currentIndex];

      // After exit animation completes, change card and start enter animation
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setAnimateTextOut(false);

        // Small delay before enter animation starts
        setTimeout(() => {
          setAnimateTextIn(true);
          setIsAnimating(false);
        }, 100);
      }, 400); // Duration of exit animation
    },
    [isAnimating, currentIndex, cards]
  );

  const nextSlide = useCallback(() => {
    performSlide((prev) => prev + 1);
  }, [performSlide]);

  const prevSlide = useCallback(() => {
    performSlide((prev) => prev - 1);
  }, [performSlide]);

  useEffect(() => {
    if (currentIndex >= cards.length - originalCards.length) {
      isResetting.current = true;
      setTimeout(() => {
        setCurrentIndex(originalCards.length);
        isResetting.current = false;
      }, 0);
    } else if (currentIndex < originalCards.length) {
      isResetting.current = true;
      setTimeout(() => {
        setCurrentIndex(cards.length - originalCards.length * 2);
        isResetting.current = false;
      }, 0);
    }
  }, [currentIndex, cards.length, originalCards.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Initial text animation - trigger with short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateTextIn(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleDragStart = useCallback(
    (e) => {
      if (isAnimating || isResetting.current) return;
      setIsDragging(true);
      startX.current = e.touches ? e.touches[0].clientX : e.clientX;
      currentTranslateX.current = 0;
    },
    [isAnimating]
  );

  const handleDrag = useCallback(
    (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      currentTranslateX.current = clientX - startX.current;
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    const dragThreshold = 70;

    if (currentTranslateX.current > dragThreshold) {
      prevSlide();
    } else if (currentTranslateX.current < -dragThreshold) {
      nextSlide();
    }

    startX.current = 0;
    currentTranslateX.current = 0;
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleDrag);
      document.addEventListener("touchend", handleDragEnd);
    } else {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("touchend", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDrag, handleDragEnd]);

  const activeCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center pb-20 justify-center min-h-screen bg-[#FFFCFA]">
      <style jsx>{`
        @keyframes wordFadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
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
            transform: translateY(-20px);
          }
        }

        @keyframes textFadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }

        @keyframes textFadeOutUp {
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

        .animate-text-fade-in-up {
          animation: textFadeInUp 0.6s ease-out forwards;
        }

        .animate-text-fade-out-up {
          animation: textFadeOutUp 0.4s ease-in forwards;
        }
      `}</style>

      <div
        ref={titleRef}
        className="text-center sm:mb-8 mb-0 md:mb-12 mt-24 md:mt-32 w-full max-w-[47rem]"
      >
        <h1 className="md:text-[56px] sm:text-[42px] text-[30px] sm:leading-[56px] leading-[40px] md:leading-[72px] text-black  font-normal mb-4">
          <AnimatedText
            text="Quality Products"
            animateIn={hasTitleAnimated}
            delay={0}
            marginLeft={"ml-2"}
            staggerDelay={0.15}
          />
        </h1>
        <div className="max-sm:flex items-center justify-center text-center w-full h-full">
          <p className="text-base text-[#7A7777] max-sm:w-[312px] max-sm:self-center text-center leading-[20px] sm:leading-[30px] sm:text-[24px] font-normal">
            <AnimatedText
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              animateIn={hasTitleAnimated}
              delay={0.8}
              staggerDelay={0.02}
            />
          </p>
        </div>
      </div>

      <div
        className={`relative w-full sm:h-[600px] h-[400px] md:h-[700px] select-none flex items-center justify-center overflow-hidden ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onMouseLeave={handleDragEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {cards.map((card, index) => {
            const position = index - currentIndex;

            if (Math.abs(position) > 3) return null;

            const screenWidth =
              typeof window !== "undefined" ? window.innerWidth : 1200;
            let cardSpacing;
            if (screenWidth < 640) {
              cardSpacing = screenWidth * 0.6;
            } else if (screenWidth < 1024) {
              cardSpacing = screenWidth * 0.45;
            } else {
              cardSpacing = screenWidth * 0.45;
            }

            let translateX = position * cardSpacing;
            let transalteY = 0;
            let scale = 1;
            let rotation = 0;
            let zIndex = 5;

            if (position === 0) {
              translateX = 0;
              scale = 1;
              rotation = 0;
              transalteY = -10;
              zIndex = 10;
            } else if (position > 0) {
              translateX = position * cardSpacing;
              scale = 1;
              rotation = 15;
              transalteY = isMobile ? 20 : 60;
              zIndex = 5;
            } else if (position < 0) {
              translateX = position * cardSpacing;
              scale = 1;
              rotation = -15;
              transalteY = isMobile ? 20 : 60;
              zIndex = 5;
            }

            return (
              <div
                key={`${card.id}-${Math.floor(index / originalCards.length)}`}
                className={`absolute left-1/2 top-1/2 ${
                  isResetting.current
                    ? ""
                    : "transition-all duration-700 ease-in-out"
                }`}
                style={{
                  transform: `
                    translate(-50%, -50%)
                    translateY(${transalteY}px)
                    translateX(${translateX}px)
                    scale(${scale})
                    rotate(${rotation}deg)
                  `,
                  zIndex: zIndex,
                }}
                onClick={(e) => {
                  if (Math.abs(currentTranslateX.current) < 5) {
                    nextSlide();
                  }
                }}
              >
                <div
                  className={`w-[180px] sm:w-[232px] lg:w-[350px] h-[300px] sm:h-[400px] lg:h-[500px] ${card.color}  overflow-hidden `}
                >
                  <div className="h-full overflow-hidden">
                    <img
                      src={card.image || "/placeholder.svg"}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* <button
          onClick={prevSlide}
          disabled={isAnimating || isResetting.current}
          className="absolute left-2 sm:left-4 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 z-50"
        >
          <svg
            className="w-4 h-4 sm:w-5  lg:w-6 lg:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          disabled={isAnimating || isResetting.current}
          className="absolute right-2 sm:right-4 lg:right-8 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 z-50"
        >
          <svg
            className="w-5 h-5 lg:w-6 lg:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button> */}
      </div>

      <div className="text-center w-full max-w-md relative h-20 mt-8">
        {animateTextOut && prevCardRef.current && (
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <h3
              className={`text-xl sm:text-2xl font-bold text-gray-800 mb-1 animate-text-fade-out-up`}
            >
              {prevCardRef.current.clientName}
            </h3>
            <p
              className={`text-gray-600 animate-text-fade-out-up`}
              style={{ animationDelay: "0.2s" }}
            >
              {prevCardRef.current.location}
            </p>
          </div>
        )}

        {!animateTextOut && activeCard && (
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <h3
              className={`text-xl sm:text-2xl font-bold text-gray-800 mb-1 ${
                animateTextIn ? "animate-text-fade-in-up" : "opacity-0"
              }`}
            >
              {activeCard.clientName}
            </h3>
            <p
              className={`text-gray-600 ${
                animateTextIn ? "animate-text-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: "0.4 s" }}
            >
              {activeCard.location}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityProducts;
