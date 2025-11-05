// src/lib/modular/components/FilterDrawer/registry.ts
import React from 'react';
import type { FilterDrawerProps } from './FilterPanel';

export type VariantComponent = React.ForwardRefExoticComponent<
  FilterDrawerProps & React.RefAttributes<HTMLDivElement>
>;

const registry = new Map<string, VariantComponent>();

export function registerFilterVariant(name: string, component: VariantComponent) {
  registry.set(name, component);
}

export function getFilterVariant(name: string): VariantComponent | undefined {
  return registry.get(name);
}

export type FilterPanelVariantName = string;