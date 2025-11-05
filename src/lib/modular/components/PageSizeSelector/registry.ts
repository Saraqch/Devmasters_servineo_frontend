// src/lib/modular/components/PageSizeSelector/registry.ts
import React from 'react';
import type { PageSizeSelectorProps } from './PageSizeSelector';

export type VariantComponent = React.ForwardRefExoticComponent<
  PageSizeSelectorProps & React.RefAttributes<HTMLDivElement>
>;

const registry = new Map<string, VariantComponent>();

export function registerPageSizeVariant(name: string, component: VariantComponent) {
  registry.set(name, component);
}

export function getPageSizeVariant(name: string): VariantComponent | undefined {
  return registry.get(name);
}

export type PageSizeSelectorVariantName = string;