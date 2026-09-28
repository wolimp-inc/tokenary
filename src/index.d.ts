export type TokenMap = Record<string, unknown>;

export interface CompileOptions {
  pairsMap: TokenMap;
  keyMask?: string;
  replaceMask?: string;
}

export interface ReplaceOneShotOptions extends CompileOptions {
  source: unknown;
}

export type CompiledReplacer = (source: unknown) => string;

export interface ReplaceOptions {
  source: unknown;
  compiledReplacer: CompiledReplacer;
}

export function compile(options: CompileOptions): CompiledReplacer;
export function replace(options: ReplaceOptions): string;
export function replaceOneShot(options: ReplaceOneShotOptions): string;

declare const tokenary: Readonly<{
  compile: typeof compile;
  replace: typeof replace;
  replaceOneShot: typeof replaceOneShot;
}>;

export default tokenary;
