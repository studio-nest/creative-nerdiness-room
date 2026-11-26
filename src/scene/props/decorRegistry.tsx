import type { ComponentType } from 'react';
import type { Decor, DecorKind } from '../../content/types';
import { Beanbag, BookStack, Corkboard, CrayonDrawing, Guitar, LeafPrint, LetterTray, NonLa, Pegboard, WallShelf, type DecorModelProps } from './Decor';
import { CitrusTree, HangingPothos, Monstera } from './Greenery';

/** Content names a decoration; this says how to draw it. */
export const decorModels: Record<DecorKind, ComponentType<DecorModelProps>> = {
  nonLa: NonLa,
  guitar: Guitar,
  monstera: Monstera,
  citrusTree: CitrusTree,
  hangingPothos: HangingPothos,
  pegboard: Pegboard,
  corkboard: Corkboard,
  crayonDrawing: CrayonDrawing,
  leafPrint: LeafPrint,
  wallShelf: WallShelf,
  beanbag: Beanbag,
  letterTray: LetterTray,
  bookStack: BookStack,
};

export function DecorItem({ item }: { item: Decor }) {
  const Model = decorModels[item.kind];
  return (
    <group position={item.position} rotation-y={item.rotationY ?? 0} scale={item.scale ?? 1}>
      <Model variant={item.variant} />
    </group>
  );
}
