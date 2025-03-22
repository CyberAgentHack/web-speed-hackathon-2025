import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';
import { memo } from 'react';

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

interface Props {
  series: {
    id: string;
    thumbnailUrl: string;
    title: string;
  };
}

// thumbnailUrl の拡張子を .webp に変更
function changeImageExtension(url: string) {
  return url.replace(/(\.\w+)(\?.*)?$/, '_400w.webp$2');
}

// ここでは props が変更されない場合のメモ化を行うためにカスタム比較関数を使用
const areEqual = (prevProps: { series: { id: string } }, nextProps: { series: { id: string } }) => {
  return prevProps.series.id === nextProps.series.id;  // `id` が同じなら再レンダリングを避ける
};

const SeriesItem = ({ series }: Props) => {
  return (
    <Hoverable classNames={{ hovered: 'opacity-75' }}>
      <NavLink viewTransition className="block w-full overflow-hidden" to={`/series/${series.id}`}>
        {({ isTransitioning }) => {
          return (
            <>
              <div className="relative overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]">
                <Flipped stagger flipId={isTransitioning ? `series-${series.id}` : 0}>
                  <img alt="" className="h-auto w-full" src={changeImageExtension(series.thumbnailUrl)} loading="lazy" decoding="async"/>
                </Flipped>
              </div>
              <div className="p-[8px]">
                <div className="text-[14px] font-bold text-[#ffffff]">
                  <Ellipsis ellipsis reflowOnResize maxLine={2} text={series.title} visibleLine={2} />
                </div>
              </div>
            </>
          );
        }}
      </NavLink>
    </Hoverable>
  );
};

// カスタム比較関数を渡してメモ化
export default memo(SeriesItem, areEqual);
