import { useEffect, useMemo, useState } from "react";
import { shuffleArray } from "./utils/shuffle-array";
import { Background } from "./components/background";
import { KANJI_5, KANJI_4, KANJI_3 } from "./kanji";

const KANJI = {...KANJI_5, ...KANJI_4, ...KANJI_3};

export const App = () => {
  const [selected, setSelected] = useState<string | null>(null);
  // const [selectedState, setSelectedState] = useState<0 | 1 | 2>(1);

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

  // FADE KANJI IN IN BLOCKS AT STAGGED TIME INTERVALS. A,B,C,D,E CLASSNAMES RANDOMLY ASSIGNED?

  return (
    <>
      <Background />
      {/* <div className="container-kanji">
        {kanji.map(kanji => (
          <div 
            className={`kanji ani-${ Math.floor(Math.random() * 8)} ${selected === kanji ? 'selected ani-0' : ''}`}
            key={kanji}
            onClick={() => handleSelectKanji(kanji)}
          >
            {kanji}
          </div>
        ))}
        {selected ? (
          <div className="kanji-meaning">
            {KANJI[selected].meaning}
          </div>
        ) : null}
      </div> */}
    </>

  );
}
