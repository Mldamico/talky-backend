export class Helpers {
  static firstLetterUppercase(str: string): string {
    const valueString = str.toLowerCase();
    return valueString
      .split(" ")
      .map(
        (val: string) =>
          `${val.charAt(0).toUpperCase()}${val.slice(1).toLowerCase()}`
      )
      .join(" ");
  }

  static lowerCase(str: string): string {
    return str.toLowerCase();
  }
}
