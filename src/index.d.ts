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

export function compile(options: CompileOptions): Promise<CompiledReplacer>;
export function replace(options: ReplaceOptions): Promise<string>;
export function replaceOneShot(options: ReplaceOneShotOptions): Promise<string>;

export { compile as compileAdapter };
export { replace as replaceAdapter };
export { replaceOneShot as replaceOneShotAdapter };

declare const tokenary: Readonly<{
  compile: typeof compile;
  replace: typeof replace;
  replaceOneShot: typeof replaceOneShot;
  compileAdapter: typeof compile;
  replaceAdapter: typeof replace;
  replaceOneShotAdapter: typeof replaceOneShot;
}>;

export default tokenary;
