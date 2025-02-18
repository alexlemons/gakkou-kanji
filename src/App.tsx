import { useEffect, useMemo, useRef, useState, UIEvent } from "react";
import { shuffleArray } from "./utils/shuffle-array";
import { Background } from "./components/background";

import { KANJI_5, KANJI_4, KANJI_3 } from "./kanji";

// function getWords(mode: Mode) {
//   switch (mode) {
//     case "hiragana":
//       return HIRAGANA_1;
//     case "katakana":
//       return KATAKANA_1;
//     default:
//       return HIRAGANA_1;
//   }
// }

const KANJI = {...KANJI_5, ...KANJI_4, ...KANJI_3};

export const App = () => {
  // const [mode, setMode] = useState<Mode>("hiragana");

  const [selected, setSelected] = useState<string | null>(null);
  // const [selectedState, setSelectedState] = useState<0 | 1 | 2>(1);

  // const scrollTimeout = useRef<number>(0)

  const kanji = useMemo(() => {
    // const words = getWords();
    return shuffleArray(Object.keys(KANJI));
  }, []);

  useEffect(() => {
    if (!selected) {
      setSelected(kanji[Math.floor(Math.random() * kanji.length)])
    }
  }, [kanji]);

  const handleSelectKanji = (kanji: string) => {
    setSelected(kanji);
    // setSelectedState(1);
  }

  // const handleScroll = (e: UIEvent<HTMLDivElement>) => {
  //   e.stopPropagation();

  //   clearTimeout(scrollTimeout.current);
  //   scrollTimeout.current = setTimeout(() => {
  //     handleSelectWord(kanji[Math.floor(Math.random() * kanji.length)]);
  //   }, 200);

  //   if (selectedWord !== null) {
  //     setSelectedState(0);
  //   }
  // }

  // FADE KANJI IN IN BLOCKS AT STAGGED TIME INTERVALS. A,B,C,D,E CLASSNAMES RANDOMLY ASSIGNED?

  return (
    <>
      <Background />
      <div className="container-kanji">
        {kanji.map(kanji => (
          <div 
            className={`kanji ani-${ Math.floor(Math.random() * 8)} ${selected === kanji ? 'selected ani-0' : ''}`}
            key={kanji}
            onClick={() => handleSelectKanji(kanji)}
          >
            {kanji}
          </div>
        ))}
      </div>

      {selected ? (
        <>
          <span>
            {KANJI[selected].meaning}
          </span>
          {/* <br /> */}
          {/* <span>
            {KANJI_1[selected][1]}
          </span> */}
        </>
      ) : null}
    </>

  );
}
