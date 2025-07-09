import { useEffect, useState } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navRef, isNavVisible] = useIntersectionObserver(0.1);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isNavVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isNavVisible, hasAnimated]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div ref={navRef} className="absolute top-0 left-0 right-0 z-50 p-0 sm:p-4">
      <style jsx>{`
        @keyframes navFadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        .nav-animate {
          animation: navFadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
          opacity: 0;
          transform: translateY(20px);
        }
      `}</style>

      <nav className="bg-white h-[81px] sm:h-[101px] w-full px-10">
        <div className="h-full w-full self-center flex justify-between items-center">
          <div className="flex items-center self-center w-full justify-between">
            <div className="flex items-center justify-center space-x-12">
              <div className="hidden md:flex items-center text-sm font-normal leading-[140%] justify-center space-x-8">
                {["About", "News", "Services", "Our Team", "Make Enquiry"].map(
                  (item, index) => (
                    <a
                      key={item}
                      href="#"
                      className={`text-black hover:text-gray-800 transition-colors duration-300 ${
                        hasAnimated ? "nav-animate" : ""
                      }`}
                      style={{
                        animationDelay: hasAnimated ? `${index * 0.1}s` : "0s",
                      }}
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
            </div>

            <div className="md:hidden flex items-center justify-between w-full">
              <button
                className={`md:hidden flex items-center gap-3 justify-center border border-black text-black hover:text-black/60 w-[148px] h-[36px] bg-[#FFFCFA] hover:bg-[white] transition-all duration-300 group ${
                  hasAnimated ? "nav-animate" : ""
                }`}
                style={{
                  animationDelay: hasAnimated ? "0.2s" : "0s",
                }}
              >
                <span className="flex flex-row items-center text-base font-normal leading-[110px] justify-center gap-3">
                  <span>Contact us</span>
                  <img
                    src="/assets/shape.svg"
                    alt=""
                    className="w-[18px] h-[14px]"
                  />
                </span>
              </button>

              <button
                onClick={toggleMenu}
                className={`relative w-8 h-8 bg-[#F9F4EE] px-5 flex flex-col justify-center items-center focus:outline-none ${
                  hasAnimated ? "nav-animate" : ""
                }`}
                style={{
                  animationDelay: hasAnimated ? "0.3s" : "0s",
                }}
                aria-label="Toggle menu"
              >
                <span
                  className={`block w-6 h-0.5 bg-black transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-black mt-1 transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-black mt-1 transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </button>
            </div>

            <button
              className={`hidden md:flex items-center gap-3 justify-center border border-black text-black hover:text-black/60 w-[148px] h-[36px] bg-[#FFFCFA] hover:bg-[white] transition-all duration-300 group ${
                hasAnimated ? "nav-animate" : ""
              }`}
              style={{
                animationDelay: hasAnimated ? "0.5s" : "0s",
              }}
            >
              <span className="flex flex-row items-center text-base font-normal leading-[110px] justify-center gap-3">
                <span>Contact us</span>
                <img
                  src="/assets/shape.svg"
                  alt=""
                  className="w-[18px] h-[14px]"
                />
              </span>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 transform transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "translate-y-0 opacity-100 visible"
              : "-translate-y-4 opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col py-4 px-6 space-y-4">
            {["About", "News", "Services", "Our Team", "Make Enquiry"].map(
              (item, index) => (
                <a
                  key={item}
                  href="#"
                  className="text-black hover:text-black/60 transition-colors duration-300 py-2 border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
