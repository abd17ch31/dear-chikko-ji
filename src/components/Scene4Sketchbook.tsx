import React, { useRef, memo } from 'react';
import { ScrapbookPage, AnniversarySettings } from '../types';
import { Heart, MoveRight } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';

interface Scene4SketchbookProps {
  settings: AnniversarySettings;
  pages: ScrapbookPage[];
  onNextScene: () => void;
  active?: boolean;
}

const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode; isLeft?: boolean; isHard?: boolean }>(
  ({ children, isLeft, isHard }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-[#f4f0e6] relative overflow-hidden text-slate-900 border-2 border-stone-800 shadow-xl ${isHard ? 'bg-[#1e2330] text-slate-100' : ''}`}
        data-density={isHard ? 'hard' : 'soft'}
      >
        {!isHard && (
          <div className="absolute inset-0 bg-[radial-gradient(#e5dec9_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none opacity-50" />
        )}

        {!isHard && (
          <div
            className={`absolute top-0 bottom-0 w-8 bg-gradient-to-r from-stone-400/30 via-stone-300/10 to-transparent pointer-events-none z-10 ${
              isLeft ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'
            }`}
          />
        )}

        <div className="relative h-full w-full p-6 sm:p-8">{children}</div>
      </div>
    );
  }
);
Page.displayName = 'Page';

export const Scene4Sketchbook: React.FC<Scene4SketchbookProps> = memo(({
  settings,
  pages,
  onNextScene,
  active = true,
}) => {
  const flipBookRef = useRef<any>(null);
  const moonImageUrl = '/images/bookflow/moon.png';

  const bookPages: React.ReactNode[] = [];
  pages.forEach((page, index) => {
    bookPages.push(
      <Page key={`page-left-${index}`} isLeft={true}>
        {page.leftPageElements.map((el) => (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              left: `${el.x}%`,
              top: `${el.y}%`,
              transform: `rotate(${el.rotation || 0}deg) scale(${el.scale || 1})`,
            }}
            className="max-w-[80%] pointer-events-none"
          >
            {el.type === 'quote' && (
              <div className="p-4 bg-amber-50/90 rounded-sm border border-amber-200 shadow-md font-serif italic text-sm sm:text-base text-stone-800 leading-snug">
                "{el.content}"
              </div>
            )}
            {el.type === 'photo' && (
              <div className="p-2 pb-3 bg-white rounded shadow-md border border-stone-200 w-44 sm:w-52 pointer-events-none">
                <div className="w-full h-32 sm:h-40 overflow-hidden bg-stone-100 rounded">
                  <img src={el.content} alt="Scrapbook Memory" className="w-full h-full object-cover" />
                </div>
                {el.caption && <p className="text-[11px] font-mono text-stone-600 mt-2 text-center">{el.caption}</p>}
              </div>
            )}
            {el.type === 'sticker' && <div className="text-3xl sm:text-4xl filter drop-shadow">{el.content}</div>}
            {el.type === 'tape' && (
              <div className="w-20 h-5 bg-rose-200/80 backdrop-blur-xs border border-rose-300/60 rotate-3 shadow-xs rounded-xs" />
            )}
          </div>
        ))}
      </Page>
    );

    bookPages.push(
      <Page key={`page-right-${index}`} isLeft={false}>
        {page.rightPageElements.map((el) => (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              left: `${el.x}%`,
              top: `${el.y}%`,
              transform: `rotate(${el.rotation || 0}deg) scale(${el.scale || 1})`,
            }}
            className="max-w-[80%] pointer-events-none"
          >
            {el.type === 'quote' && (
              <div className="p-4 bg-rose-50/90 rounded-sm border border-rose-200 shadow-md font-serif italic text-sm sm:text-base text-stone-800 leading-snug">
                "{el.content}"
              </div>
            )}
            {el.type === 'photo' && (
              <div className="p-2 pb-3 bg-white rounded shadow-md border border-stone-200 w-44 sm:w-52 pointer-events-none">
                <div className="w-full h-32 sm:h-40 overflow-hidden bg-stone-100 rounded">
                  <img src={el.content} alt="Scrapbook Memory" className="w-full h-full object-cover" />
                </div>
                {el.caption && <p className="text-[11px] font-mono text-stone-600 mt-2 text-center">{el.caption}</p>}
              </div>
            )}
            {el.type === 'sticker' && <div className="text-3xl sm:text-4xl filter drop-shadow">{el.content}</div>}
          </div>
        ))}
      </Page>
    );
  });

  return (
    <div className="relative h-full w-full bg-[#111625] text-slate-100 flex flex-col justify-between p-4 sm:p-8 overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/30 via-[#111625] to-[#0a0d17] pointer-events-none" />

      <div className="relative z-10 flex-1 my-6 flex items-center justify-center touch-none">
        <HTMLFlipBook
          key="flipbook-v3"
          width={350}
          height={480}
          size="stretch"
          minWidth={250}
          maxWidth={1000}
          minHeight={300}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={false}
          className="demo-book mx-auto shadow-2xl"
          ref={flipBookRef}
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={600}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={false}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={false}
          disableFlipByClick={true}
        >
          <Page isHard={true}>
            <div className="flex flex-col justify-between h-full pt-4">
              <div className="flex justify-between items-start">
                <span className="text-3xl">🍒</span>
                <div className="px-3 py-1 bg-amber-100 text-slate-900 rounded-sm rotate-3 text-xs font-mono font-bold shadow">
                  ANNIVERSARY EDITION
                </div>
                <span className="text-3xl">🎀</span>
              </div>

              <div className="py-6 flex flex-col items-center gap-2">
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  {'SKETCH'.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-10 sm:w-10 sm:h-12 bg-stone-100 text-slate-900 font-extrabold text-xl sm:text-2xl rounded flex items-center justify-center shadow-md ${
                        idx % 2 === 0 ? 'rotate-2' : '-rotate-3 bg-amber-50'
                      }`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  {'BOOK'.split('').map((char, idx) => (
                    <div
                      key={`book-${idx}`}
                      className={`w-8 h-10 sm:w-10 sm:h-12 bg-stone-100 text-slate-900 font-extrabold text-xl sm:text-2xl rounded flex items-center justify-center shadow-md ${
                        idx % 2 === 0 ? '-rotate-2 bg-amber-50' : 'rotate-3'
                      }`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-44 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-amber-300/60 shadow-inner">
                  <img src={moonImageUrl} alt="Moon" className="w-full h-full object-cover pointer-events-none" />
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-amber-300 font-medium tracking-widest uppercase flex items-center justify-center gap-1.5">
                  <span>Swipe or Click to Open</span>
                  <MoveRight className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
                </p>
              </div>
            </div>
          </Page>

          {bookPages}

          <Page isHard={true}>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mx-auto mb-4" />
                <h3 className="text-2xl font-serif text-amber-200">The End</h3>
                <p className="text-slate-400 mt-2 font-mono text-sm">Of this chapter...</p>
              </div>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>
    </div>
  );
});
