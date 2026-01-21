import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { ButtonElementProps } from '$lib/components/ui-extra/button';
import type { UseRampOptions } from '../../../blocks/use-ramp.svelte';
import type { WithElementRef } from '../../../blocks/utils';

export type NumberFieldRootProps = {
  value?: number;
  step?: number;
  min?: number;
  max?: number;
  rampSettings?: Omit<UseRampOptions, 'increment' | 'canRamp'>;
  children: Snippet;
};

export type NumberFieldButtonProps = Omit<ButtonElementProps, 'disabled'> & {
  disabled?: boolean;
};

export type NumberFieldInputProps = WithElementRef<
  Omit<HTMLInputAttributes, 'min' | 'max' | 'value' | 'type'>
>;
