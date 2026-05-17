/**
 * This component is common used for put sketch background in pages.
 * we have lots of white space in the left and right side of the pages
 * so to make it more attractive we are adding sketch background on both sides.
 */
import Image from "next/image";
import HERO_IMG from "@/assets/backgroundSketch/hero_img.png";
import HERO2_IMG from "@/assets/backgroundSketch/hero2_img.png";
import MARKET_DATA_IMG from "@/assets/backgroundSketch/market-data-bg-1.png";
import MARKET_DATA2_IMG from "@/assets/backgroundSketch/market-data-bg-2.png";

const page = {
  landing: {
    left: HERO2_IMG,
    right: HERO_IMG,
  },
  "market-data": {
    left: MARKET_DATA_IMG,
    right: MARKET_DATA2_IMG,
  },
  "the-firm": {
    left: HERO2_IMG,
    right: MARKET_DATA_IMG,
  },
  "track-record": {
    left: HERO_IMG,
    right: MARKET_DATA2_IMG,
  },
};

export default function BackgroundSketch({
  children = null,
  pageType = "landing",
}: {
  children?: React.ReactNode;
  pageType?: "landing" | "market-data" | "the-firm" | "track-record";
}) {
  const IMG1 = page[pageType].right;
  const IMG2 = page[pageType].left;

  return (
    <>
      {/* India Sketch Background Right side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-[0.05] pointer-events-none">
        <Image
          src={IMG1}
          alt="India map outline"
          className="object-contain object-right w-full h-full"
        />
      </div>
      {children}
      {/* India Sketch Background Left side */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-[0.05] pointer-events-none">
        <Image
          src={IMG2}
          alt="India map outline"
          className="object-contain object-left w-full h-full"
        />
      </div>
    </>
  );
}
