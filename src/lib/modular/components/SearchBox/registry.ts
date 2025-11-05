// src/lib/modular/components/SearchBox/registry.ts
import React from 'react';
import type { SearchBoxProps } from './SearchBox';

export type VariantComponent = React.ForwardRefExoticComponent<
  SearchBoxProps & React.RefAttributes<HTMLDivElement>
>;

const registry = new Map<string, VariantComponent>();

export function registerSearchVariant(name: string, component: VariantComponent) {
  registry.set(name, component);
}

export function getSearchVariant(name: string): VariantComponent | undefined {
  return registry.get(name);
}

export type SearchBoxVariantName = string;