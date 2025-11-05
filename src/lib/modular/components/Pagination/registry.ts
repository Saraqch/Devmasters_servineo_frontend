// src/lib/modular/components/Pagination/registry.ts
import React from 'react';
import type { PaginationProps } from './Pagination';

export type VariantComponent = React.ForwardRefExoticComponent<
  PaginationProps & React.RefAttributes<HTMLDivElement>
>;

const registry = new Map<string, VariantComponent>();

export function registerPaginationVariant(name: string, component: VariantComponent) {
  registry.set(name, component);
}

export function getPaginationVariant(name: string): VariantComponent | undefined {
  return registry.get(name);
}

export type PaginationVariantName = string;