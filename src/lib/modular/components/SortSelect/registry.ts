import React from 'react';
import type { SortSelectProps } from './SortSelect';

export type VariantComponent = React.ForwardRefExoticComponent<
  SortSelectProps & React.RefAttributes<HTMLDivElement>
>;

const registry = new Map<string, VariantComponent>();

export function registerSortVariant(name: string, component: VariantComponent) {
  registry.set(name, component);
}

export function getSortVariant(name: string): VariantComponent | undefined {
  return registry.get(name);
}

/**
 * Tipo para `variant` seguro en TS
 * Solo strings (ignorando símbolos de Map como Symbol.iterator)
 */
export type SortSelectVariantName = string;
