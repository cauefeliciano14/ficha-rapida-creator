/** O retrato é salvo só com o nome do arquivo; links e caminhos completos passam direto. */
export function portraitSrc(portrait: string): string {
  return /^(https?:|data:|blob:|\/)/.test(portrait) ? portrait : `/imgs/portrait_caracter/${portrait}`;
}
